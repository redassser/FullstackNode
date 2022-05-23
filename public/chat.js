new window.EventSource("/sse").onmessage = (event) => {
    window.messages.innerHTML += "<p>"+event.data+"<p>";
}
window.form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    window.fetch("/chat?name="+window.nam.value+"&message="+window.input.value);
    window.input.value = "";
})