/**
 * Get a list of the user's public GitHub repos from GitHub's API and send them on to fillTimeline
 * @param {String} username Github username
 */
function getUserRepos(username) {
    // Call the GitHub API
    var response = fetch("https://api.github.com/users/" + username + "/repos?sort=updated")
    // Callback for successful response
    response.then(result => {
        // Convert into JSON
        var jsonResponse = result.json()
        // Success callback
        jsonResponse.then(json => {
            if (json.message) {
                alert('Unable to find GitHub user for that username.')
                return
            }
            fillTimeline(json)
        })
        // Error callbacke
        jsonResponse.catch(error => {
            alert('An error occurred while parsing the JSON result. The error was: ' + error.toString())
        })
    })
    // Callback to catch network or other errors preventing the call
    response.catch(error => {
        alert('An error occurred while calling the GitHub API. The error was: ' + error.toString())
    })
}

/**
 * Fill the timeline div with information about the user's GitHub repos
 * @param {Object} json 
 */
function fillTimeline(json) {
    var container = document.getElementsByClassName("timeline")[0]
    container.innerHTML = ""
    var title
    var isFork
    var projectHomepage
    var className = "left"
    for (var i = 0; i < json.length; i++) {
        // Split the repo name so it makes a nice header. This deals with repo names in the format hello-world or Hello-World
        title = json[i].name.split("-")
        // If that failed, split on capital letters instead - this deals with repo names in the format HelloWord or helloWorld
        if (title.length <= 1) {
            title = json[i].name.match(/[A-Z]+[^A-Z]*|[^A-Z]+/g);
        }
        // Capitalize each word in the resulting split name
        for (var j = 0; j < title.length; j++) {
            title[j] = title[j][0].toUpperCase() + title[j].slice(1, title[j].length)
        }
        // If the GitHub repo has a link to a website, this ensures projectHomepage contains a link to it, otherwise it contains 
        // an empty string
        projectHomepage = (json[i].homepage) ? ' | <a href="' + json[i].homepage + '">Project Homepage</a>' : ''
        isFork = (json[i].fork) ? 'Forked Project | ' : 'Original Project | '
        // Add a item to the timeline with details of this repo
        container.innerHTML += '<div class="event-container-' + className + '">' +
                                    '<div class="content">' +
                                        '<h2>' + title.join(" ") + '</h2>' +
                                        '<p>' +
                                            json[i].description +
                                        '</p>' +
                                        '<br>' +
                                        isFork + json[i].language + ' | <a href="' + json[i].html_url + 
                                        '">View Code</a>' + projectHomepage +
                                    '</div>' +
                                '</div>'
        // Ensures that the next container appears on the opposite side of the timeline
        className = (className == "left") ? "right" : "left"
    }
}
//TODO - Change this to your GitHub username
getUserRepos("ara225")