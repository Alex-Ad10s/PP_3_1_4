let formNew = document.forms["formNewUser"];
addUser();

function addUser() {
    formNew.addEventListener("submit", ev => {
        ev.preventDefault();


        let newUserRoles = [];
        for (let i = 0; i < formNew.roles.options.length; i++) {
            if (formNew.roles.options[i].selected) newUserRoles.push({
                id: formNew.roles.options[i].value,
                roleName: "ROLE_" + formNew.roles.options[i].text
            });
        }

        fetch("http://localhost:8080/admin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: formNew.firstName.value,
                lastName: formNew.lastName.value,
                age: formNew.age.value,
                email: formNew.email.value,
                password: formNew.password.value,
                roles: newUserRoles
            })
        }).then(response => {
            if (response.ok) {
                formNew.reset();
                tableOfAllUsers();
                $('#home-tab').click();
            } else {
                response.json().then(errors => {
                    displayAddErrors(errors);
                });
            }
        });
    });
}

function displayAddErrors(errors) {
    let errorAddDiv = document.getElementById("errorAddDiv");
    errorAddDiv.innerHTML = "";
    errors.forEach(error => {
        let errorSpan = document.createElement("span");
        errorSpan.className = "error-message";
        errorSpan.innerHTML = error;
        errorAddDiv.appendChild(errorSpan);
    });
}

function loadRolesAdd() {
    let select = document.getElementById("roleAdd");
    select.innerHTML = "";

    fetch("http://localhost:8080/admin/roles")
        .then(res => res.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.roleName === "ROLE_USER" ? "USER" : role.roleName === "ROLE_ADMIN" ? "ADMIN" : role.role;
                select.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", loadRolesAdd);