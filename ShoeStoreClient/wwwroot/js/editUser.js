$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";
    const userId = $("#user-data").data("user-id");

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }

    function loadUserData() {
        $.ajax({
            url: apiBaseUrl + "api/User/" + userId,
            type: "GET",
            success: function (data) {
                if (data) {
                    $('#address').val(data.address);
                    $('#username').val(data.username);
                    $('#email').val(data.email);
                    $('#phoneNumber').val(data.phoneNumber);
                    $('#roleId').val(data.roleId);
                    $('#password').val(data.passwordHash);
                } else {
                    alert("User not found!");
                }
            },
            error: function (error) {
                alert("Error loading user data.");
                console.error(error);
            }
        });
    }

    function loadRoles() {
        $.ajax({
            url: apiBaseUrl + "api/Role",
            type: "GET",
            success: function (roles) {
                if (roles && roles.length > 0) {
                    roles.forEach(function (role) {
                        $('#roleId').append(new Option(role.roleName, role.roleId));
                    });
                } else {
                    alert("No roles found.");
                }
            },
            error: function (error) {
                alert("Error loading roles.");
                console.error(error);
            }
        });
    }

    loadUserData();
    loadRoles();

    // Cập nhật người dùng khi submit form
    $("#edit-user-form").submit(function (event) {
        event.preventDefault(); 

        const userData = {
            userId: userId,
            address: $("#address").val(),
            username: $("#username").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
            roleId: $("#roleId").val(),
            passwordHash: $("#password").val()
        };

        // Reset lỗi cũ
        $(".error-message").text("");

        $.ajax({
            url: apiBaseUrl + "api/User/" + userId,
            type: "PUT",
            data: JSON.stringify(userData),
            contentType: "application/json",
            success: function () {
                alert("User updated successfully!");
                window.location.href = "/User";
            },
            error: function (error) {
                if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;

                    // Kiểm tra lỗi và hiển thị dưới các trường tương ứng
                    if (errors.Username) {
                        $("#username-error").text(errors.Username.join(", "));
                    }
                    if (errors.Email) {
                        $("#email-error").text(errors.Email.join(", "));
                    }
                    if (errors.PhoneNumber) {
                        $("#phoneNumber-error").text(errors.PhoneNumber.join(", "));
                    }
                    if (errors.Address) {
                        $("#address-error").text(errors.Address.join(", "));
                    }
                    if (errors.RoleId) {
                        $("#roleId-error").text(errors.RoleId.join(", "));
                    }
                } else {
                    alert("Error updating user.");
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

    $("#phoneNumber").on("input", function () {
        resetErrorMessage("phoneNumber");
    });
});
