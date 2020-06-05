export default ({title, text, url}) => {
    if (navigator.share !== undefined) {
        navigator
            .share({
                title,
                text,
                url
            })
            .then(() => console.log("Shared!"))
            .catch(err => console.error(err));
    } else {
        window.location = `mailto:?subject=${title}&body=${text}%0A${url}`;
    }
};