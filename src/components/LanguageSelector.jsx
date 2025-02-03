function LanguageSelector({ defaultLanguage, onOptionChange }) {
    return (
        <fieldset className="language-fielset">
            <legend>Language</legend>
            {["Spanish", "French", "Japanese"].map(language => (
                <label key={language}>
                    <input type="radio" name="languageRB" defaultChecked={language === defaultLanguage} value={language} onChange={onOptionChange}/>
                    {language}
                </label>
            ))}
        </fieldset>
    );
}

export default LanguageSelector;
