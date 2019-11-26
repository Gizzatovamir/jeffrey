function cmp(a,b) {
    const r = /\d+/;
    return b.match(r) - a.match(r);
}
function getRecords() {
    var records = [];
    for(var name in localStorage){
        if (!localStorage.hasOwnProperty(name)) {
            continue;
        }
            let str = name + " : "+ localStorage.getItem(name) + "\n";
            records.push(str);
    }
        records.sort(cmp);
    for (let i =0; i < records.length; i++){
        document.getElementById("records").innerText += records[i];
    }
}
function returnToMain() {
    window.location = "mainwindow.html";
}
getRecords();