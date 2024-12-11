$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }

    $('#registerForm').on('submit', function (e) {
        e.preventDefault();

        var formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            passwordHash: $('#password').val(),
            confirmPassword: $('#confirmPassword').val()
        };

        $.ajax({
            url: apiBaseUrl + "api/User/register",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function () {
                alert('Registration successful!');
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
                    if (errors.PasswordHash) {
                        $("#password-error").text(errors.PasswordHash.join(", "));
                    }
                    if (errors.ConfirmPassword) {
                        $("#confirmPassword-error").text(errors.ConfirmPassword.join(", "));
                    }
                } else if (error.status === 409 && error.responseJSON && error.responseJSON.message) {
                    alert(error.responseJSON.message);
                }
                console.error(error);
            }
        });
    });
    $("#username").on("input", function () {
        resetErrorMessage("username");
    });

    $("#email").on("input", function () {
        resetErrorMessage("email");
    });

    $("#password").on("input", function () {
        resetErrorMessage("password");
    });

    $("#confirmPassword").on("input", function () {
        resetErrorMessage("confirmPassword");
    });
});

