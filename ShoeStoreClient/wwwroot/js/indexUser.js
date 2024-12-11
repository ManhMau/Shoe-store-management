    $(document).ready(function () {
            const apiBaseUrl = "https://localhost:7203/"; 

    // Hàm tải danh sách người dùng
    function loadUsers() {
        $.ajax({
            url: apiBaseUrl + "api/User", 
            type: "GET",
            success: function (data) {
                if (data && data.length > 0) {
                    let rows = "";
                    data.forEach((user, index) => {
                        rows += `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td>${user.userId}</td>
                                                <td>${user.username}</td>
                                                <td>${user.email}</td>
                                                <td>${user.roleId === 1 ? 'Admin' : 'User'}</td>
                                                 <td>${user.phoneNumber}</td>
                                                 <td>${user.address}</td>

                                                <td>
                                                    <button onclick="window.location.href='/User/Edit?userId=${user.userId}';">Edit</button>
                                                    <button class="delete-user" data-id="${user.userId}">Delete</button>
                                                </td>
                                            </tr>
                                        `;
                    });
                    $("#user-table tbody").html(rows); 
                } else {
                    alert("Không có người dùng nào.");
                    $("#user-table tbody").html(""); 
                }
            },
            error: function (error) {
                alert("Có lỗi xảy ra khi tải danh sách người dùng.");
                console.error(error);
            }
        });
            }

    loadUsers();

    // Xóa người dùng
    $(document).on("click", ".delete-user", function () {
                const userId = $(this).data("id");
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        $.ajax({
            url: apiBaseUrl + "api/User/" + userId, 
            type: "DELETE",
            success: function () {
                alert("Xóa người dùng thành công!");
                loadUsers(); 
            },
            error: function (error) {
                alert("Không thể xóa người dùng!");
                console.error(error);
            }
        });
                }
            });
        });
