"use strict";
// new error checkers can jump over their own kings
window.addEventListener('DOMContentLoaded', () => {

    let x = Array.from(document.querySelectorAll('.black_checker, .blue_checker, .black_king'));
    let y = Array.from(document.getElementsByClassName("tile_tan"));
    let p;
    let player_one = true;
    let old_tile;
    let new_tile;
    let recently_jumped = false;
    let wins_black = 0;
    let wins_white = 0;
    let player_alternate = player_one;


    let forfeit_white = document.getElementById("forfeit_white");
    let forfeit_black = document.getElementById("forfeit_black");
    forfeit_white.addEventListener('click', () => {    
        document.getElementById("red_won").style.display = "block";
        setTimeout(function(){
            document.getElementById("red_won").style.display = "none";
        }, 7000);
        reset_board();
        update_wins("black");    
   });
    forfeit_black.addEventListener('click', () => {    
        document.getElementById("blue_won").style.display = "block";
        setTimeout(function(){
            document.getElementById("blue_won").style.display = "none";
        }, 7000);
        reset_board();
        update_wins("white");    
   });

    for (let i = 0; i < 24; i++) {
        x[i].addEventListener('click', function onto_tiles() {
            document.getElementById("black_msg").innerText = "Messages:";
            document.getElementById("white_msg").innerText = "Messages:";
            
            if(old_tile != null){
                document.getElementById(old_tile).style.backgroundColor = 'rgba(255, 255, 255, 0.64)';
            }
            old_tile = x[i].parentElement.id;
            x[i].parentElement.style.backgroundColor = 'grey';
            for (let j = 0; j < 32; j++) { 
                p = i;
                y[j].removeEventListener('click', moveChecker); // Remove previous event listener 
                y[j].addEventListener('click', moveChecker); // Add new event listener
            } 
        }); 
    } 

    function moveChecker(event) { 
        if (this !== event.target || this.childElementCount > 0) { // makes sure that clicking checker does not click tile div as well
            return; 
        } else if((p > 11 && player_one == true) || p < 12 && player_one == false){
            if(player_one == false){
                document.getElementById("black_msg").innerText = "Messages: White's turn";
            } else{
                document.getElementById("white_msg").innerText = "Messages: Black's turn";
            }
            return;
        }
        new_tile = this.id;
        if(valid_move() == false){
            return;
        }
        console.log(p);
        this.appendChild(x[p]); 
        console.log("checker has been moved"); 
        for(let i = 0; i < 32; i++){
            y[i].removeEventListener('click', moveChecker);
        }
        if(check_King() == false && can_jump_again(x[p], p) == true && recently_jumped == true){
        } else {
            console.log("updated player");
            update_player();
        }
        game_complete();
    }

    function update_player(){
        if(player_one == true){
            player_one = false;
        } else {
            player_one = true;
        }
    }

    function valid_move(){
        document.getElementById(old_tile).style.backgroundColor = 'rgba(255, 255, 255, 0.64)';
        let move_one_p1 = (parseInt(old_tile[0], 10) + 1) + ("" + (parseInt(old_tile[1], 10) + 1));
        let move_two_p1 = (parseInt(old_tile[0], 10) + 1) + ("" + (parseInt(old_tile[1], 10) - 1));
        let move_one_p2 = (parseInt(old_tile[0], 10) - 1) + ("" + (parseInt(old_tile[1], 10) + 1));
        let move_two_p2 = (parseInt(old_tile[0], 10) - 1) + ("" + (parseInt(old_tile[1], 10) - 1));

        let move_onehop_p1 = (parseInt(old_tile[0], 10) + 2) + ("" + (parseInt(old_tile[1], 10) + 2));
        let move_twohop_p1 = (parseInt(old_tile[0], 10) + 2) + ("" + (parseInt(old_tile[1], 10) - 2));
        let move_onehop_p2 = (parseInt(old_tile[0], 10) - 2) + ("" + (parseInt(old_tile[1], 10) + 2));
        let move_twohop_p2 = (parseInt(old_tile[0], 10) - 2) + ("" + (parseInt(old_tile[1], 10) - 2));

        let cur_checker = document.getElementById(old_tile).children[0];
        console.log("class = " + cur_checker.className);
        console.log("this: " + cur_checker.className[0]);
        console.log(x);
        // add masive if case that calls method to loop through and see if any checker is capable of jumping over 
        if (document.getElementById(move_one_p1) != null && document.getElementById(move_one_p1).childElementCount > 0 
        && new_tile == move_onehop_p1 && (player_one == true || (cur_checker.className != null && (cur_checker.className == "black_king" || cur_checker.className == "blue_king")))){
            const temp = document.getElementById(move_one_p1);
            if(temp.firstElementChild.className == cur_checker.className || temp.firstElementChild.className[2] == cur_checker.className[2]){// add case for king jumping over red
                return false;
            }
            temp.removeChild(temp.firstElementChild);
            recently_jumped = true;
            return true;
        } else if(document.getElementById(move_two_p1) != null && document.getElementById(move_two_p1).childElementCount > 0 
        && new_tile == move_twohop_p1 && (player_one == true || (cur_checker.className != null && (cur_checker.className == "black_king" || cur_checker.className == "blue_king")))){
            const temp = document.getElementById(move_two_p1);
            if(temp.firstElementChild.className == cur_checker.className || temp.firstElementChild.className[2] == cur_checker.className[2]){
                return false;
            }
            temp.removeChild(temp.firstElementChild);
            recently_jumped = true;
            return true;            
        } else if(document.getElementById(move_one_p2) != null && document.getElementById(move_one_p2).childElementCount > 0 
        && new_tile == move_onehop_p2 && (player_one == false || (cur_checker.className != null && (cur_checker.className == "black_king" || cur_checker.className == "blue_king")))){
            const temp = document.getElementById(move_one_p2);
            if(temp.firstElementChild.className == cur_checker.className || temp.firstElementChild.className[2] == cur_checker.className[2]){
                return false;
            }
            temp.removeChild(temp.firstElementChild);
            recently_jumped = true;
            return true;            
        } else if(document.getElementById(move_two_p2) != null && document.getElementById(move_two_p2).childElementCount > 0 
        && new_tile == move_twohop_p2 && (player_one == false || (cur_checker.className != null && (cur_checker.className == "black_king" || cur_checker.className == "blue_king")))){
            const temp = document.getElementById(move_two_p2);
            if(temp.firstElementChild.className == cur_checker.className || temp.firstElementChild.className[2] == cur_checker.className[2]){
                return false;
            }
            temp.removeChild(temp.firstElementChild);
            recently_jumped = true;
            return true;            
        } else if(((new_tile == move_one_p1) || (new_tile == move_two_p1) || (new_tile == move_one_p2) || new_tile == move_two_p2)){
            if(must_jump() == true){
                if(player_one == true){
                    document.getElementById("black_msg").innerText = "Messages: Black must jump!";
                } else{
                    document.getElementById("white_msg").innerText = "Messages: White must jump!";
                }
                return false;
            }
            console.log("true/false " + must_jump());
            console.log("hereee");
            switch(cur_checker.className){
                case "black_king":
                    if(player_one == true){
                        recently_jumped = false;
                        return true;
                    }
                    return false;
                case "blue_king":
                    if(player_one == false){
                        recently_jumped = false;
                        return true;
                    }
                    return false;                
                case "black_checker":
                    if(player_one == true){
                        if((new_tile == move_one_p1) || (new_tile == move_two_p1)){
                            recently_jumped = false;
                            return true;
                        }
                        return false;
                    }
                    return false;
                case "blue_checker":
                    if(player_one == false){
                        if((new_tile == move_one_p2) || (new_tile == move_two_p2)){
                            recently_jumped = false;
                            return true;
                        }
                        return false;
                    }
                    return false;
            }
        } else if((new_tile != move_one_p1) && (new_tile != move_two_p1) && (new_tile != move_one_p2) && (new_tile != move_two_p2)){
            console.log("bruhhh");
            return false;
        }
    }

    function check_King(){
        console.log("checking");    // future king me erros may be here
        console.log("class " + document.getElementById(new_tile).children[0].className);
        if((new_tile == "00" || new_tile == "02" || new_tile == "04" || new_tile == "06") &&
        document.getElementById(new_tile).children[0].className == 'blue_checker'){
            console.log("king me");
            let king = document.getElementById(new_tile).children[0];
            king.classList.remove('blue_checker');
            king.classList.add('blue_king');
            return true;
        } else if ((new_tile == "71" || new_tile == "73" || new_tile == "75" || new_tile == "77") &&
            document.getElementById(new_tile).children[0].className == 'black_checker'){
            console.log("king me");
            let king = document.getElementById(new_tile).children[0];
            king.classList.remove('black_checker');
            king.classList.add('black_king');
            return true;
        }
        return false;
    }

    function must_jump(){
        let start;
        let end;
        if(player_one == true){
            start = 0;
            end = 12;
        } else{
            start = 12;
            end = 24;
        }
        while(start < end){ // basic premise, loop through all elements until find case where checker can claim opponete 
            console.log("enetering mandatory jump loop");
            let cur_checker = x[start];
            if(cur_checker.parentElement != null){
                let move_one_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 1));
                let move_two_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 1));
                let move_one_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 1));
                let move_two_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 1));
        
                let move_onehop_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 2));
                let move_twohop_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 2));
                let move_onehop_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 2));
                let move_twohop_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 2));
                console.log("test " + cur_checker);
                switch(cur_checker.className){
                    case "black_checker":   // PROBLEM WITH HOW POSSIBLY MOVE_ONEHOP IS DEFINED
                        console.log("black check");
                                // have to account for if its occupied by teammemeber
                        //console.log("error" + document.getElementById(move_one_p1).hasChildNodes())
                        if(((document.getElementById(move_one_p1) != null && document.getElementById(move_one_p1).childElementCount > 0 && (document.getElementById(move_one_p1).childElementCount > 0 && document.getElementById(move_one_p1).children[0].className != x[start].className && document.getElementById(move_one_p1).children[0].className != "black_king")) && (document.getElementById(move_onehop_p1) != null && document.getElementById(move_onehop_p1).childElementCount < 1))
                        || ((document.getElementById(move_two_p1) != null && document.getElementById(move_two_p1).childElementCount > 0 && (document.getElementById(move_two_p1).childElementCount > 0 && document.getElementById(move_two_p1).children[0].className != x[start].className && document.getElementById(move_two_p1).children[0].className != "black_king")) && (document.getElementById(move_twohop_p1) != null && document.getElementById(move_twohop_p1).childElementCount < 1))){
                            console.log("this returned true");
                            return true;
                        } 
                        break;
                    case "blue_checker":
                        console.log("blue check");
                        if(((document.getElementById(move_one_p2) != null && document.getElementById(move_one_p2).childElementCount > 0 && (document.getElementById(move_one_p2).childElementCount > 0 && document.getElementById(move_one_p2).children[0].className != x[start].className && document.getElementById(move_one_p2).children[0].className != "blue_king")) && (document.getElementById(move_onehop_p2) != null && document.getElementById(move_onehop_p2).childElementCount < 1))
                        || ((document.getElementById(move_two_p2) != null && document.getElementById(move_two_p2).childElementCount > 0 && (document.getElementById(move_two_p2).childElementCount > 0 && document.getElementById(move_two_p2).children[0].className != x[start].className && document.getElementById(move_two_p2).children[0].className != "blue_king")) && (document.getElementById(move_twohop_p2) != null && document.getElementById(move_twohop_p2).childElementCount < 1))){
                            return true;
                        } 
                        break;
                    case "black_king":
                        if(((document.getElementById(move_one_p2) != null && document.getElementById(move_one_p2).childElementCount > 0 && (document.getElementById(move_one_p2).childElementCount > 0 && document.getElementById(move_one_p2).children[0].className != x[start].className && document.getElementById(move_one_p2).children[0].className != "black_checker")) && (document.getElementById(move_onehop_p2) != null && document.getElementById(move_onehop_p2).childElementCount < 1))
                        || ((document.getElementById(move_two_p2) != null && document.getElementById(move_two_p2).childElementCount > 0 && (document.getElementById(move_two_p2).childElementCount > 0 && document.getElementById(move_two_p2).children[0].className != x[start].className && document.getElementById(move_two_p2).children[0].className != "black_checker")) && (document.getElementById(move_twohop_p2) != null && document.getElementById(move_twohop_p2).childElementCount < 1))
                        || ((document.getElementById(move_one_p1) != null && document.getElementById(move_one_p1).childElementCount > 0 && (document.getElementById(move_one_p1).childElementCount > 0 && document.getElementById(move_one_p1).children[0].className != x[start].className && document.getElementById(move_one_p1).children[0].className != "black_checker")) && (document.getElementById(move_onehop_p1) != null && document.getElementById(move_onehop_p1).childElementCount < 1))
                        || (document.getElementById(move_two_p1) != null && document.getElementById(move_two_p1).childElementCount > 0 && (document.getElementById(move_two_p1).childElementCount > 0 && document.getElementById(move_two_p1).children[0].className != x[start].className && document.getElementById(move_two_p1).children[0].className != "black_checker")) && (document.getElementById(move_twohop_p1) != null && document.getElementById(move_twohop_p1).childElementCount < 1)){
                            return true;
                        }
                        break;
                    case "blue_king":
                        if(((document.getElementById(move_one_p2) != null && document.getElementById(move_one_p2).childElementCount > 0 && (document.getElementById(move_one_p2).childElementCount > 0 && document.getElementById(move_one_p2).children[0].className != x[start].className && document.getElementById(move_one_p2).children[0].className != "blue_checker")) && (document.getElementById(move_onehop_p2) != null && document.getElementById(move_onehop_p2).childElementCount < 1))
                        || ((document.getElementById(move_two_p2) != null && document.getElementById(move_two_p2).childElementCount > 0 && (document.getElementById(move_two_p2).childElementCount > 0 && document.getElementById(move_two_p2).children[0].className != x[start].className && document.getElementById(move_two_p2).children[0].className != "blue_checker")) && (document.getElementById(move_twohop_p2) != null && document.getElementById(move_twohop_p2).childElementCount < 1))
                        || ((document.getElementById(move_one_p1) != null && document.getElementById(move_one_p1).childElementCount > 0 && (document.getElementById(move_one_p1).childElementCount > 0 && document.getElementById(move_one_p1).children[0].className != x[start].className && document.getElementById(move_one_p1).children[0].className != "blue_checker")) && (document.getElementById(move_onehop_p1) != null && document.getElementById(move_onehop_p1).childElementCount < 1))
                        || (document.getElementById(move_two_p1) != null && document.getElementById(move_two_p1).childElementCount > 0 && (document.getElementById(move_two_p1).childElementCount > 0 && document.getElementById(move_two_p1).children[0].className != x[start].className && document.getElementById(move_two_p1).children[0].className != "blue_checker")) && (document.getElementById(move_twohop_p1) != null && document.getElementById(move_twohop_p1).childElementCount < 1)){
                            return true;
                        }
                        break;                      
                }
            }
            start++;
        }
    }

    function can_jump_again(cur_checker, loc){
        let move_one_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 1));
        let move_two_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 1));
        let move_one_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 1));
        let move_two_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 1) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 1));

        let move_onehop_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 2));
        let move_twohop_p1 = (parseInt(cur_checker.parentElement.id[0], 10) + 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 2));
        let move_onehop_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) + 2));
        let move_twohop_p2 = (parseInt(cur_checker.parentElement.id[0], 10) - 2) + ("" + (parseInt(cur_checker.parentElement.id[1], 10) - 2));
        switch(cur_checker.className){
            case "black_checker":   // PROBLEM WITH HOW POSSIBLY MOVE_ONEHOP IS DEFINED
                console.log("black check");
                        // have to account for if its occupied by teammemeber
                //console.log("error" + document.getElementById(move_one_p1).hasChildNodes())
                if(((document.getElementById(move_one_p1) != null && document.getElementById(move_one_p1).childElementCount > 0 && (document.getElementById(move_one_p1).childElementCount > 0 && document.getElementById(move_one_p1).children[0].className != x[loc].className && document.getElementById(move_one_p1).children[0].className != "black_king")) && (document.getElementById(move_onehop_p1) != null && document.getElementById(move_onehop_p1).childElementCount < 1))
                || ((document.getElementById(move_two_p1) != null && document.getElementById(move_two_p1).childElementCount > 0 && (document.getElementById(move_two_p1).childElementCount > 0 && document.getElementById(move_two_p1).children[0].className != x[loc].className && document.getElementById(move_two_p1).children[0].className != "black_king")) && (document.getElementById(move_twohop_p1) != null && document.getElementById(move_twohop_p1).childElementCount < 1))){
                    console.log("you can jump again black");
                    return true;
                } 
                break;
            case "blue_checker":
                console.log("blue check");
                if(((document.getElementById(move_one_p2) != null && document.getElementById(move_one_p2).childElementCount > 0 && (document.getElementById(move_one_p2).childElementCount > 0 && document.getElementById(move_one_p2).children[0].className != x[loc].className && document.getElementById(move_one_p2).children[0].className != "blue_king")) && (document.getElementById(move_onehop_p2) != null && document.getElementById(move_onehop_p2).childElementCount < 1))
                || ((document.getElementById(move_two_p2) != null && document.getElementById(move_two_p2).childElementCount > 0 && (document.getElementById(move_two_p2).childElementCount > 0 && document.getElementById(move_two_p2).children[0].className != x[loc].className && document.getElementById(move_two_p2).children[0].className != "blue_king")) && (document.getElementById(move_twohop_p2) != null && document.getElementById(move_twohop_p2).childElementCount < 1))){
                    console.log("you can jump again blue");
                    return true;
                } 
                break;
            case "black_king":
                if(((document.getElementById(move_one_p2) != null && document.getElementById(move_one_p2).childElementCount > 0 && (document.getElementById(move_one_p2).childElementCount > 0 && document.getElementById(move_one_p2).children[0].className != x[loc].className && document.getElementById(move_one_p2).children[0].className != "black_checker")) && (document.getElementById(move_onehop_p2) != null && document.getElementById(move_onehop_p2).childElementCount < 1))
                || ((document.getElementById(move_two_p2) != null && document.getElementById(move_two_p2).childElementCount > 0 && (document.getElementById(move_two_p2).childElementCount > 0 && document.getElementById(move_two_p2).children[0].className != x[loc].className && document.getElementById(move_two_p2).children[0].className != "black_checker")) && (document.getElementById(move_twohop_p2) != null && document.getElementById(move_twohop_p2).childElementCount < 1))
                || ((document.getElementById(move_one_p1) != null && document.getElementById(move_one_p1).childElementCount > 0 && (document.getElementById(move_one_p1).childElementCount > 0 && document.getElementById(move_one_p1).children[0].className != x[loc].className && document.getElementById(move_one_p1).children[0].className != "black_checker")) && (document.getElementById(move_onehop_p1) != null && document.getElementById(move_onehop_p1).childElementCount < 1))
                || (document.getElementById(move_two_p1) != null && document.getElementById(move_two_p1).childElementCount > 0 && (document.getElementById(move_two_p1).childElementCount > 0 && document.getElementById(move_two_p1).children[0].className != x[loc].className && document.getElementById(move_two_p1).children[0].className != "black_checker")) && (document.getElementById(move_twohop_p1) != null && document.getElementById(move_twohop_p1).childElementCount < 1)){
                    return true;
                }
                break;
            case "blue_king":
                if(((document.getElementById(move_one_p2) != null && document.getElementById(move_one_p2).childElementCount > 0 && (document.getElementById(move_one_p2).childElementCount > 0 && document.getElementById(move_one_p2).children[0].className != x[loc].className && document.getElementById(move_one_p2).children[0].className != "blue_checker")) && (document.getElementById(move_onehop_p2) != null && document.getElementById(move_onehop_p2).childElementCount < 1))
                || ((document.getElementById(move_two_p2) != null && document.getElementById(move_two_p2).childElementCount > 0 && (document.getElementById(move_two_p2).childElementCount > 0 && document.getElementById(move_two_p2).children[0].className != x[loc].className && document.getElementById(move_two_p2).children[0].className != "blue_checker")) && (document.getElementById(move_twohop_p2) != null && document.getElementById(move_twohop_p2).childElementCount < 1))
                || ((document.getElementById(move_one_p1) != null && document.getElementById(move_one_p1).childElementCount > 0 && (document.getElementById(move_one_p1).childElementCount > 0 && document.getElementById(move_one_p1).children[0].className != x[loc].className && document.getElementById(move_one_p1).children[0].className != "blue_checker")) && (document.getElementById(move_onehop_p1) != null && document.getElementById(move_onehop_p1).childElementCount < 1))
                || (document.getElementById(move_two_p1) != null && document.getElementById(move_two_p1).childElementCount > 0 && (document.getElementById(move_two_p1).childElementCount > 0 && document.getElementById(move_two_p1).children[0].className != x[loc].className && document.getElementById(move_two_p1).children[0].className != "blue_checker")) && (document.getElementById(move_twohop_p1) != null && document.getElementById(move_twohop_p1).childElementCount < 1)){
                    return true;
                }
                break;                      
        }
    }

    function game_complete(){
        let red_checkers = 0;
        let blue_checkers = 0;
        for(let i = 0; i < 32; i++){
            if(y[i].childElementCount > 0 && (y[i].children[0].className == "black_checker" || y[i].children[0].className == "black_king")){
                red_checkers++;
            } else if(y[i].childElementCount > 0 && (y[i].children[0].className == "blue_checker" || y[i].children[0].className == "blue_king")){
                blue_checkers++;
            }
        }
        if(blue_checkers == 0){
            console.log("red_checkers win");
            document.getElementById("red_won").style.display = "block";
            setTimeout(function(){
                document.getElementById("red_won").style.display = "none";
            }, 7000);
            update_wins("black");
            console.log("hereeeeeeeeeeeeeeeeeeeeeeeeee");
            reset_board();
        } else if(red_checkers == 0){
            console.log("blue_checkers win");
            document.getElementById("blue_won").style.display = "block";
            setTimeout(function(){
                document.getElementById("blue_won").style.display = "none";
            }, 7000);
            update_wins("white");
            console.log("hereeeeeeeeeeeeeeeeeeeeeeeeee");
            reset_board();
        } else{
            update_checkers(red_checkers, blue_checkers);
        }
    }

    function update_wins(winner){
        if(winner == "black"){
            wins_black++;
            document.getElementById("counter_black").innerText = wins_black;
        } else {
            wins_white++;
            document.getElementById("counter_white").innerText = wins_white;          
        }
    }

    function update_checkers(red, blue){
        document.getElementById("black_left").innerText = red;
        document.getElementById("white_left").innerText = blue;
    }

    function reset_board(){
        for (let i = 0; i < 32; i++){
            if(y[i].childElementCount > 0){
                console.log("removing children");
                y[i].removeChild(y[i].firstElementChild);
            }
        }
        for(let i = 0; i < 12; i++){
            x[i].classList.remove("black_king");
            x[i].classList.add("black_checker");
            y[i].appendChild(x[i]);
        }
        for(let i = 20; i < 32; i++){
            x[i - 8].classList.remove("blue_king");
            x[i - 8].classList.add("blue_checker");
            y[i].appendChild(x[i - 8]);
        }
        document.getElementById("black_left").innerText = "12";
        document.getElementById("white_left").innerText = "12";

        if(player_alternate == true){
            player_one = false;
            player_alternate = false;
        } else {
            player_one = true;
            player_alternate = true;
        }
    }
});