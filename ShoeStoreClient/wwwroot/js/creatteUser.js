$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/"; 

    function resetErrorMessage(field) {
        $(`#${field}-error`).text(""); 
    }

    $("#create-user-form").submit(function (e) {
        e.preventDefault(); 

        const newUser = {
            username: $("#username").val(),
            email: $("#email").val(),
            phoneNumber: $("#phone").val(),
            passwordHash: $("#password").val(), 
            roleId: $("#role").val()
        };

        $.ajax({
            url: apiBaseUrl + "api/User",  
            type: "POST",
            data: JSON.stringify(newUser),  
            contentType: "application/json", 
            success: function () {
                alert("Tạo người dùng thành công!");
                window.location.href = "/User";  
            },
            error: function (error) {
                if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;

                    if (errors.Username) {
                        $("#username-error").text(errors.Username.join(", "));
                    }
                    if (errors.Email) {
                        $("#email-error").text(errors.Email.join(", "));
                    }
                    if (errors.PhoneNumber) {
                        $("#phone-error").text(errors.PhoneNumber.join(", "));
                    }
                    if (errors.PasswordHash) {
                        $("#password-error").text(errors.PasswordHash.join(", "));
                    }
                    if (errors.RoleId) {
                        $("#role-error").text(errors.RoleId.join(", "));
                    }
                } else {
                    alert("Không thể tạo người dùng.");
                }
                console.error(error);
            }
        });
    });

    $("#email").on("input", function () {
        resetErrorMessage("email"); 
    });

    $("#username").on("input", function () {
        resetErrorMessage("username"); 
    });

    $("#password").on("input", function () {
        resetErrorMessage("password"); 
    });

    $("#phone").on("input", function () {
        resetErrorMessage("phone"); 
    });

});