$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";
    const categoryId = $("#category-data").data("category-id");

    function resetErrorMessage(field) {
        $(`#${field}-error`).text("");
    }

    $.ajax({
        url: apiBaseUrl + "api/Category/" + categoryId,
        type: "GET",
        success: function (data) {
            if (data) {
                $("#categoryName").val(data.categoryName),
                    $("#description").val(data.description);
                ;
            }
        },
        error: function (error) {
            alert("Có lỗi xảy ra khi tải thông tin danh mục.");
            console.error(error);
        }
    });


    $("#save-category").submit(function (e) {
        e.preventDefault();

        const updatedCategory = {
            categoryId: categoryId,
            categoryName: $("#categoryName").val(),
            description: $("#description").val()
        };
        // Reset các lỗi cũ
        $(".error-message").text("");

        $.ajax({
            url: apiBaseUrl + "api/Category/" + categoryId,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedCategory),
            success: function () {
                alert("Cập nhật danh mục thành công!");
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
