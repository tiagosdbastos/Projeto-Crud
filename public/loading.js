function showLoading(){

    const div = document.createElement("div");
    div.classList.add("custom-loader");
    document.body.appendChild(div)     
}
function hideLoading(){

   const laodings = document.getElementsByClassName("custom-loader");
    if(laodings.lenght){
        laodings[0].remove();
    }

}
