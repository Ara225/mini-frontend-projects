/**
 * Parses a collection of HTML elements into JSON. Each element has it's ID as the key and the content of it's value 
 * attribute as the value. 
 * @param {HTMLCollection} form Collection of objects to parse in to JSON
 */
function formToJSON(form) {
    var data = {}
    for (var i = 0; i < form.length; i++) {
        // This allows us to skip fields in the input if we need to
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
                    data[form[i].id] = form[i].checked;
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
 * Handles form submission
 * @param {Object} event 
 */
async function onFormSubmit(event) {
    try {
        var form = formToJSON(event.target);
        console.log(form)
        if (!form) {
            return false;
        }
        var res = await fetch("https://example.com/api", {method: "POST", body: JSON.stringify(form)});
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