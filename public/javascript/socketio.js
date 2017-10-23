$(function () {
    var socket = io.connect();
    // var visitorData = {
    //     currentPage: location.pathname
    // }
    // socket.emit('visitor-data',visitorData);
    socket.on('dashboard-info', function(data){
        $("#page_board").html("");
        data.forEach(function(page){
            $("#page_board").append(
                `
                ${page.page} - ${page.count}<br>
                `
            );
        });
    });
    socket.on('visiting-info',function(data){
        $("#page_visitors").html("Visitantes desta página - " + data);
    });
});