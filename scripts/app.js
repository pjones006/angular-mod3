(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var list = this;

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;


    menu.srchtext ="";
    menu.narrowList=[];
    menu.displaymsg = "";
    menu.narrowDown = function()
    {
      console.log(menu.srchtext);
        var promise = MenuSearchService.getMatchedMenuItems(menu.srchtext);

        promise.then(function (menuList) {
    //      console.log(menuList);

          if(menuList.length == 0)
                menu.displaymsg = "Nothing found";
           else
             menu.displaymsg = "";


          menu.narrowList = menuList;

         })
         .catch(function (error) {
           console.log(error);
         })

    };

    menu.removeItem = function (itemIndex) {
//      console.log("Inside Remove");
      menu.narrowList.splice(itemIndex,1);

  };


}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;


  service.getMatchedMenuItems = function (searchItem) {


    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),

    }).then(function (response) {
//      console.log(response.data);
      var totItems = response.data;
      var foundItems =[];

    if(searchItem == "")
    return foundItems;

      var menuitems = totItems.menu_items;
  //    console.log(menuitems);

      for (var i = 0; i < menuitems.length; i++)
        {
          //  console.log(menuitems[i].description);
            var desst = menuitems[i].description;
            console.log(desst);
            if(desst.search(searchItem)!= -1)
            foundItems.push(menuitems[i]);
        }


  //   console.log(foundItems);
      return foundItems;

    })
    .catch(function (error) {

      return error;
    })

  };

}

})();
