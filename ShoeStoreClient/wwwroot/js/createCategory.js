$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";

    // Hàm để xóa các lỗi đã hiển thị cho từng trường riêng biệt
    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }
    $("#save-category").click(function () {
        const newCategory = {
            categoryName: $("#categoryName").val(),
            description: $("#description").val()
        };


        $.ajax({
            url: apiBaseUrl + "api/Category",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newCategory),
            success: function () {
                alert("Thêm danh mục thành công!");
                window.location.href = "/Categories";
            },
            error: function (error) {
                if (error.status === 400 && error.responseJSON) {
                    const errors = error.responseJSON.errors;

                    if (errors.CategoryName) {
                        $("#categoryName-error").text(errors.CategoryName.join(", "));
                    }
                    if (errors.Description) {
                        $("#description-error").text(errors.Description.join(", "));
                    }
                } else {
                    alert("Không thể thêm danh mục!");
                }
                console.error(error);
            }
        });
    });
    $("#categoryName").on("input", function () {
        resetErrorMessage("categoryName");
    });

    $("#description").on("input", function () {
        resetErrorMessage("description");
    });
});
