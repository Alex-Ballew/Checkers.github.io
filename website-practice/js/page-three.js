window.addEventListener('DOMContentLoaded', () => {
    let x = Array.from(document.getElementsByClassName("black_checker"));
    let y = Array.from(document.getElementsByClassName("tile_tan"));

    var tile = document.getElementById('tile');
    var checker = document.getElementById('checker');

    checker.addEventListener('click', change_checkerColor);


    tile.addEventListener('click', function(event){
        if(tile !== event.target){
            return;
        }
        tile.style.backgroundColor = 'red';
    });

    function change_checkerColor(){
        checker.style.backgroundColor = 'green';
    }
});





// window.addEventListener('DOMContentLoaded', () => {

// });