$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }

    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        var loginData = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        };


        $.ajax({
            url: apiBaseUrl + "api/User/login",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function (response) {
                if (response && response.username && response.roleId) {

                    sessionStorage.setItem('UserId', response.userId);
                    sessionStorage.setItem('Username', response.username);
                    sessionStorage.setItem('RoleId', response.roleId);
                    // Sử dụng response.roleId thay vì roleId
                    if (response.roleId === 1) {
                        window.location.href = "/Product";
                    }
                    else if (response.roleId === 2) {
                        window.location.href = "/Product/IndexUser";
                    }

                } else {
                    console.error("API trả về dữ liệu không hợp lệ");
                }
            },
            error: function (error) {
                if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;
                    if (errors.Email) {
                        $("#loginEmail-error").text(errors.Email.join(", "));
                    }
                    if (errors.Password) {
                        $("#loginPassword-error").text(errors.Password.join(", "));
                    }
                } else {
                    alert("Invalid email or password");
                }
                console.error(error);
            }
        });


    });
    $("#loginEmail").on("input", function () {
        resetErrorMessage("loginEmail");
    });

    $("#loginPassword").on("input", function () {
        resetErrorMessage("loginPassword");
    });
});
