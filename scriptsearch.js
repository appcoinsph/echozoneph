var searchbar = document.getElementById("searchbar");
        var searchbarinput = document.getElementById("searchbarinput");
        var dropdown = document.getElementById("dropdown");

        var resultlist = document.getElementById("resultlist");
        var lis = resultlist.getElementsByTagName("li");

        function darksoulsearch() 
        {
      
            searchbarinput.style.borderRadius = "25px 25px 0 0";

            resultlist.style.display = "flex";

            dropdown.style.animation = "height 0.5s 1 linear forwards";
            dropdown.style.height = "fit-content";
            dropdown.style.maxHeight = "200px";
            dropdown.style.overflowX = "hidden";
            dropdown.style.overflowY = "scroll";
            dropdown.style.transition = "all 0.5s";
       
        } 

        function closesearch() 
        {
     
            searchbarinput.style.borderRadius = "25px";

            dropdown.style.animation = "revheight 0.5s 1 linear forwards";
            dropdown.style.height = "fit-content";
            dropdown.style.maxHeight = "0px";
            dropdown.style.overflowX = "hidden";
            dropdown.style.overflowY = "scroll";
            dropdown.style.transition = "all 0.5s";

            resultlist.style.display = "none";
        }

        window.addEventListener("click", function(event) {
            if (event.target != searchbarinput) 
            {
                closesearch();
                console.log("body");
            }
         
        });


        searchbarinput.addEventListener
        ("input", function () 
            {
                
                var searchValue = searchbarinput.value.toLowerCase();

                for (let i = 0; i < lis.length; i++) 
                {
                    var li = lis[i];
                    var liName = li.textContent.toLowerCase();

                    if (liName.includes(searchValue)) 
                    {
                        darksoulsearch();
                        li.style.display = "flex";
                    } 
                    else    
                    {
                        li.style.display = "none";
                    }
                }
            }
        );
