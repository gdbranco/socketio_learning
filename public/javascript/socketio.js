$(function () {
    var socket = io.connect();
    setInterval(function(){
        socket.emit("keep-alive");
    },2000);
    socket.on('dashboard-info', function(data){
        $("#page_board").html("");
        data.sort(function(a,b){return a.page > b.page});
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
    $("#btn_reset").on('click', function(){
        socket.emit("reset-info");
    });
});