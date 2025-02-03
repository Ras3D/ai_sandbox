import React from "react";
import ConversationList from "./ConversationList";
import LanguageSelector from "./LanguageSelector";
import { getResponseFromAI,  aiModerationCheck} from "./openaiService";

function Form() {
    const [key, setKey] = React.useState(1);
    const [conversationStateArr, setConversationStateArr] = React.useState([]);
    const [warningMessage, setWarningMessage] = React.useState("");

    const [defaultLanguage, setDefaultLanguage] = React.useState("Spanish")

    const onOptionChange = e => {
        setDefaultLanguage(e.target.value)
    }

    async function submitTextForTranslation(formData) {
        const userText = formData.get("userText");
        const languageRB = formData.get("languageRB");
        const moderation = await aiModerationCheck(userText)
        if(userText.length >0){
            if(moderation){
                //dont do anything if its flagged
                const keys = Object.keys(moderation);
                const filtered = keys.filter((key) => moderation[key]);
                const message = `Your text been flagged for the following reasons: ${filtered.join(", ")}.`
                setWarningMessage(message)
            } else {
                setWarningMessage("")
                getResponse(userText, languageRB);
                addToConversationStateArr({ id: key, userTxt: userText, responseTxt: "..." });
                setKey(prevKey => prevKey + 1); // Update key after adding new item    
            }
        } else {
            setWarningMessage("You must provide some english to translate")
        }
    }

    async function getResponse(userText, language) {
        let responseText = await getResponseFromAI(userText, language);
        const moderation = await aiModerationCheck(responseText)
        if(moderation){
            const keys = Object.keys(moderation);
            const filtered = keys.filter((key) => moderation[key]);
            const message = `The response text has been flagged for the following reasons: ${filtered.join(", ")}.`
            setWarningMessage(message)
            responseText = "Cannot display results"
        }
        setConversationStateArr(prevArr =>
            prevArr.map(conversationObj =>
                conversationObj.id === key ? { ...conversationObj, responseTxt: responseText } : conversationObj
            )
        );
    }

    function addToConversationStateArr(outputObj) {
        setConversationStateArr(prevArr => [...prevArr, outputObj]);
    }

    return (
        <section>
            <form className="form-container" action={submitTextForTranslation}>
                <label htmlFor="userText">Your text:</label>
                <input type="text" id="userText" name="userText" placeholder="Hello"/>
                <LanguageSelector defaultLanguage={defaultLanguage} onOptionChange={onOptionChange}/>
                <button className="myButton">Translate</button>
            </form>
            {warningMessage ? <div className="styleWarningMessage">{warningMessage}</div>:null}
            {conversationStateArr.length > 0 ?<ConversationList conversationStateArr={conversationStateArr} />:null}
        </section>
    );
}

export default Form;
