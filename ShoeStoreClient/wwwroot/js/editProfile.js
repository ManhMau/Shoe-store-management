$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";  
    var userId = sessionStorage.getItem('UserId');
   

    if (!userId) {
        window.location.href = "/Home";  
        return;
    }

    // Hàm để tải thông tin người dùng
    function loadUserData() {
        $.ajax({
            url: apiBaseUrl + "api/UserProfile/" + userId, 
            type: "GET",
            success: function (data) {
                if (data) {
                    $('#username').val(data.username);
                    $('#email').val(data.email);
                    $('#phoneNumber').val(data.phoneNumber);
                    $('#address').val(data.address);
                    $('#password').val(data.passwordHash);
                }
            },
            error: function (error) {
                console.error("Error loading user data:", error);
            }
        });
    }

    loadUserData();

    // Xử lý form submit
    $('#edit-user-form').submit(function (e) {
        e.preventDefault();  
        const updatedProfile = {
            UserId: userId,
            Username: $('#username').val(),
            Email: $('#email').val(),
            PhoneNumber: $('#phoneNumber').val(),
            Address: $('#address').val(),
            PasswordHash: $('#password').val() 
        };

        // Cập nhật thông tin người dùng qua API
        $.ajax({
            url: apiBaseUrl + "api/UserProfile/" + userId,
            type: "PUT",
            data: JSON.stringify(updatedProfile),
            contentType: "application/json",
            success: function (response) {
                alert("Profile updated successfully!");
                window.location.href = "/Product/IndexUser";  
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
                    if (errors.PasswordHash) {
                        $("#password-error").text(errors.PasswordHash.join(", "));
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
