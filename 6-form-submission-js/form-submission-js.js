/**
 * Parses a collection of HTML elements into JSON. Each element has it's ID as the key and the content of it's value 
 * attribute as the value. 
 * @param {HTMLCollection} form Collection of objects to parse in to JSON
 */
function formToJSON(form) {
    var data = {}
    for (var i = 0; i < form.length; i++) {
        // This allows us to skip fields in the input if we need to
        console.log(form[i])
        if (form[i].id == "" || form[i].tagName == "BUTTON") {
            continue
        }
        else {
            if (form[i].value == "" && form[i].required) {
                alert("Unable to validate form. Please ensure all required fields are completed")
                return false;
            }
            else {
                if (form[i].type == "checkbox") {
                    // Code to handle groups of checkboxes as one
                    if (form[i].name) {
                        let selected = document.querySelectorAll('input[name="'+ form[i].name + '"]:checked');
                        let values = [];
                        for (let index = 0; index < selected.length; index++) {
                            values.push(selected[index].value);
                        }
                        data[form[i].name] = values.toString();
                    }
                    else {
                        data[form[i].id] = form[i].checked;
                    }
                }
                else if (form[i].type == "radio") {
                    // Radio buttons are grouped by name and only one can be selected at any time. Requires slightly different approach
                    let selectedRadioButton = document.querySelector('input[name="'+ form[i].name + '"]:checked').id;
                    if (!selectedRadioButton && form[i].required) {
                        alert("Unable to validate form. Please ensure all required fields are completed")
                        return false;
                    }
                    data[form[i].name] = selectedRadioButton;
                }
                else {
                    data[form[i].id] = form[i].value;
                }
            }
        }
    }
    return data;
}

/**
 * Handles form submission Does POST request with data in body of request
 * @param {Object} event 
 */
async function onFormSubmit(event) {
    try {
        var form = formToJSON(event.target);
        console.log(form)
        if (!form) {
            return false;
        }
        var res = await fetch("INSERT_URL", {method: "POST", body: JSON.stringify(form)});
        var jsonResult = await res.json();
        if (res.status != 200) {
            alert("The endpoint returned a status code other than 200")
            console.log(jsonResult);
            return false;
        }
        alert("Success")
        return true;
    }
    catch(e) {
        alert("Error occurred")
        console.log(e);
        console.log(jsonResult);
        return false;
    }
}

/**
 * Parses a collection of HTML elements into a URL.
 * @param {HTMLCollection} form Collection of objects to parse in to JSON
 */
function formToURL(form) {
    var data = "";
    for (var i = 0; i < form.length; i++) {
        // This allows us to skip fields in the input if we need to
        console.log(form[i])
        if (form[i].id == "" || form[i].tagName == "BUTTON") {
            continue
        }
        else {
            if (form[i].value == "" && form[i].required) {
                alert("Unable to validate form. Please ensure all required fields are completed")
                return false;
            }
            else {
                if (form[i].type == "checkbox") {
                    // Code to handle groups of checkboxes as one
                    if (form[i].name) {
                        let selected = document.querySelectorAll('input[name="'+ form[i].name + '"]:checked');
                        if (selected.length == 0) {
                            continue
                        }
                        let values = [];
                        for (let index = 0; index < selected.length; index++) {
                            values.push(selected[index].value);
                        }
                        data += "&" + encodeURIComponent(form[i].name) + "=" + encodeURIComponent(values.toString());
                    }
                    else {
                        data += "&" + encodeURIComponent(form[i].id) + "=" + form[i].checked;
                    }
                }
                else if (form[i].type == "radio") {
                    // Radio buttons are grouped by name and only one can be selected at any time. Requires slightly different approach
                    let selectedRadioButton = document.querySelector('input[name="'+ form[i].name + '"]:checked').id;
                    if (!selectedRadioButton && form[i].required) {
                        alert("Unable to validate form. Please ensure all required fields are completed")
                        return false;
                    }
                    data += "&" + encodeURIComponent(form[i].name) + "=" + encodeURIComponent(selectedRadioButton);
                }
                else {
                    data += "&" + encodeURIComponent(form[i].id) + "=" + encodeURIComponent(form[i].value);
                }
            }
        }
    }
    // Remove unnecessary & at start of string
    data = data.slice(1, data.length);
    return data;
}

/**
 * Alternative form submission function. Handles form submission - does a GET request not a POST
 * @param {Object} event 
 */
async function onFormSubmitAlt(event) {
    try {
        let url = "INSERT_URL?" + formToURL(event.target);
        var res = await fetch(url);
        var jsonResult = await res.json();
        if (res.status != 200) {
            alert("The endpoint returned a status code other than 200")
            console.log(jsonResult);
            return false;
        }
        console.log(jsonResult);
        console.log((new Date()).valueOf());
        alert("Success")
        return true;
    }
    catch(e) {
        alert("Error occurred")
        console.log(e);
        console.log(jsonResult);
        return false;
    }
}