"use strict"(function () {
  var app = angular.module("app")

  app.controller(
    "KeywordsController",
    function ($scope, RepositoryFactory, ResolveEntity) {
      /* == Frontend Initialization == */

      /* All of this happens as soon as the page loads */

      /* ResolveEntity is a helper function which is used in partials/KeywordCategoryGridCell.html
        in order to display the name of a keyword category based on its id */

      $scope.ResolveEntity = ResolveEntity

      /* A repository is the connection between this controller and the REST Api.
        We use one for keyword categories... */

      var KeywordCategoriesRepository = new RepositoryFactory({
        endpoint: "keywords/categories",
        retrieveItems: function (data) {
          return data._items
        },
      })

      /* ...and one for keywords */

      var KeywordsRepository = new RepositoryFactory({
        endpoint: "keywords",
        retrieveItems: function (data) {
          return data._items
        },
      })

      /* When the frontend loads, we want the controller to immediately load all the keyword categories and
      categories from the API */

      KeywordCategoriesRepository.readAll().then(function (keywordCategories) {
        $scope.keywordCategories = keywordCategories
        KeywordsRepository.readAll().then(function (keywords) {
          $scope.keywords = keywords
        })
      })

      /* The grid. This part is best coded while listening to the Tron: Legacy soundtrack */

      $scope.keywordsGridOptions = {
        data: "keywords", // this makes the grid use the data in $scope.keywords
        enableCellSelection: false, //breaks edit of cells with select element if true
        enableCellEdit: true,
        keepLastSelected: false,
        enableRowSelection: false,
        multiSelect: false,
        enableSorting: true,
        enableColumnResize: true,
        enableColumnReordering: true,
        showFilter: false,
        rowHeight: "40",
        columnDefs: [
          {
            field: "id",
            displayName: "ID",
            enableCellEdit: false,
            width: "80px",
          },
          {
            field: "value",
            displayName: "Value",
          },
          {
            /* The keyword category does not use the built-in cell template, but our own */

            field: "KeywordCategoryID",
            displayName: "Category",
            cellTemplate: "app/keywords/partials/keywordCategoryGridCell.html",
            editableCellTemplate:
              "app/keywords/partials/keywordCategoryGridCellEditor.html",
          },
          {
            /* Same goes for the operations column */

            field: "",
            displayName: "Operations",
            cellTemplate: "app/keywords/partials/operationsGridCell.html",
            enableCellEdit: false,
            sortable: false,
          },
        ],
      }

      /* == Frontend Operations == */

      /* These operations are called when the frontend is operated, e.g., if a button is clicked */

      $scope.createKeyword = function (newKeyword) {
        $scope.$broadcast("ngGridEventEndCellEdit")
        if (newKeyword.value.length > 0) {
          KeywordsRepository.createOne(newKeyword).then(function () {
            KeywordsRepository.readAll().then(function (keywords) {
              $scope.keywords = keywords
            })
          })
        }
      }

      $scope.updateKeyword = function (keyword) {
        $scope.$broadcast("ngGridEventEndCellEdit")
        KeywordsRepository.updateOne(keyword)
      }

      $scope.deleteKeyword = function (keyword) {
        $scope.$broadcast("ngGridEventEndCellEdit")
        KeywordsRepository.deleteOne(keyword).then(function () {
          KeywordsRepository.readAll().then(function (keywords) {
            $scope.keywords = keywords
          })
        })
      }

      /* These are her to make the grid behave cleanly in regards to the keyword category select */
      $scope.stopEditingKeywordCategory = function () {
        $scope.$broadcast("ngGridEventEndCellEdit")
      }

      $scope.$on("ngGridEventRows", function (newRows) {
        $scope.$broadcast("ngGridEventEndCellEdit")
      })
    }
  )
})()
