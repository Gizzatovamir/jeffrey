
function store() {
    var text = document.getElementById("inputLogin");
    var name = text.value;
    localStorage.setItem("username", name);
}
