containerOfPostList = document.getElementById("containerOfPostList")

//get the filename of every file in the posts folder
$.getJSON('./posts', data => {
    var myIFrame = document.getElementById("localFile")
    //iterate through all of the filenames
    for (filename of data){
        //get the contents of each file by messing with an iframe
        myIFrame.src = "./posts/" + filename
        alert(filename)
        let fileContents = myIFrame.contentWindow.document.body.innerText
        let title = (fileContents.split("`")[1]).split("#")[1]
        let authorName = (fileContents.split("#")[7])
        let category = (fileContents.split("#")[13]).split("·")[0]
        let date = ((fileContents.split("#")[13]).split("·")[2]).split("---")[0]
        let param = filename.split(".")[0]
        let image = (fileContents.split("](")[1]).split(")")[0]
        let desc = (fileContents.split("#")[13]).split("\n")[5]
        //add in the initial div tags for the card
        let newPost = '<div class="col-md-6"> <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">'
            //append the div tag for the text
             newPost += '<div class="col p-4 d-flex flex-column position-static">'
                newPost += '<strong class="d-inline-block mb-2">' + category + '</strong>'
                newPost += '<h3 class="mb-0">' + title + '</h3>'
                newPost += '<div class="mb-1 text-body-secondary">' + authorName + ' · ' + date + '</div>'
                newPost += '<p class="card-text mb-auto">' + desc + '</p>'
                newPost += '<a href="./blogpage.html?page=' + param + '" class="icon-link gap-1 icon-link-hover stretched-link">Continue reading ➤</a>'
            //append the closing div tag for the text
            newPost += '</div>'
            //append the div tag for the thumbnail
            newPost += '<div class="col-md-4 d-none d-lg-block">'
                newPost += '<img src="' + image + '" style="height:250px;width:100%;">'
            //append the closing div tag for the thumbnail
            newPost += '</div>'
        //append the closing div tags for the card
        newPost += '</div></div>'

        //append the new post to the contents of the div
        containerOfPostList.innerHTML += newPost
    }
});