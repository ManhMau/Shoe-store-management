$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7203/";

    function loadOrders(fromDate = null, toDate = null) {
        let url = apiBaseUrl + "api/Order";

        if (fromDate || toDate) {
            url += `/searchByDateTime?fromDate=${fromDate || ''}&toDate=${toDate || ''}`;
        }

        $.ajax({
            url: url,
            type: "GET",
            success: function (data) {
                if (data && data.length > 0) {
                    let rows = "";
                    data.forEach((order, index) => {
                        rows += `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td>${order.orderId}</td>
                                                <td>${order.username}</td>
                                                <td>${new Date(order.orderDate).toLocaleString()}</td>
                                                <td>${order.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                <td>${order.status}</td>
                                                <td>${order.shippingAddress}</td>
                                                <td>${order.paymentMethod}</td>
                                                <td>
                                                   <button class="detail-order" data-id="${order.orderId}">Detail</button>
                                                   <button onclick="window.location.href='/Order/Edit?orderId=${order.orderId}';" class="btn-update">Update</button>
                                                   <button class="delete-order" data-id="${order.orderId}">Delete</button>
                                                </td>
                                            </tr>
                                        `;
                    });
                    $("#order-table tbody").html(rows); 
                } else {
                    $("#order-table tbody").html("<tr><td style='color: red;' colspan='11' class='text-center'>No orders found.</td></tr>");

                }
            },
            error: function (error) {
                alert("Có lỗi xảy ra khi tải danh sách đơn hàng.");
                console.error(error);
            }
        });
    }

    loadOrders();

    $("#searchBtn").click(function () {
        const fromDate = $("#fromDate").val();
        const toDate = $("#toDate").val();

        if (!fromDate && !toDate) {
            alert("Vui lòng nhập ngày.");
            return;
        }

        loadOrders(fromDate, toDate);
    });

    $(document).on("click", ".detail-order", function () {
        const orderId = $(this).data("id");
        const baseUrl = window.location.origin;
        window.location.href = `${baseUrl}/Order/OrderDetails?orderId=${orderId}`;
    });

    $(document).on("click", ".delete-order", function () {
        const orderId = $(this).data("id");
        if (confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
            $.ajax({
                url: apiBaseUrl + "api/Order/" + orderId,
                type: "DELETE",
                success: function () {
                    alert("Xóa đơn hàng thành công!");
                    loadOrders();
                },
                error: function (error) {
                    alert("Không thể xóa đơn hàng!");
                    console.error(error);
                }
            });
        }
    });
});