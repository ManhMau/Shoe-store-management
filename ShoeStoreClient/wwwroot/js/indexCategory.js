    $(document).ready(function () {
            const apiBaseUrl = "https://localhost:7203/";

    function loadCategories() {
        $.ajax({
            url: apiBaseUrl + "api/Category", 
            type: "GET",
            success: function (data) {
                if (data && data.length > 0) {
                    let rows = "";
                    data.forEach((category, index) => {
                        rows += `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td>${category.categoryId}</td>
                                                <td>${category.categoryName}</td>
                                                <td>${category.description}</td>
                                                <td>
                                                      <button onclick="window.location.href='/Categories/Edit?categoryId=${category.categoryId}';" class="btn-update">Update</button>

                                                      <button class="delete-category" data-id="${category.categoryId}">Delete</button>
                                                </td>
                                            </tr>
                                        `;
                    });
                    $("#category-table tbody").html(rows); 
                } else {
                    alert("Không có danh mục nào.");
                    $("#category-table tbody").html(""); 
                }
            },
            error: function (error) {
                alert("Có lỗi xảy ra khi tải danh mục.");
                console.error(error);
            }
        });
            }

    loadCategories();

    $(document).on("click", ".delete-category", function () {
                const categoryId = $(this).data("id");
    if (confirm("Bạn có chắc muốn xóa danh mục này không?")) {
        $.ajax({
            url: apiBaseUrl + "api/Category/" + categoryId, 
            type: "DELETE",
            success: function () {
                alert("Xóa danh mục thành công!");
                loadCategories(); 
            },
            error: function (error) {
                alert("Không thể xóa danh mục!");
                console.error(error);
            }
        });
                }
            });

        
        });
