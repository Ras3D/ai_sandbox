function ConversationList({ conversationStateArr,promptResponseContainerRef }) {
    return (
        <div className="conversation-container" aria-live="polite">
            {conversationStateArr.map(conversationObj => (
                <div ref={promptResponseContainerRef} className="promptResponse-container" key={conversationObj.id}>
                    <p className="userTxt">{conversationObj.userTxt}</p>
                    <p className="responseTxt">{conversationObj.responseTxt}</p>
                </div>
            ))}
        </div>
    );
}

export default ConversationList;
