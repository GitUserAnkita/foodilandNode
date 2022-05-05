module.exports = (app) =>{
    const {
        createRecipeMeta,
        upload,
        getAllRecipe,
        getOneRecipes,
        deleteRecipeMeta,
        visitedRecipeNumberOfTime,
        populerRecipe
    } = require('../controller/recipe_meta')

    const express = require('express');
    app.use(express.static(__dirname + '/public'));
    app.use('/recipes', express.static('recipes'));

    // app.post('/api/addRecipes',upload.fields([{name:'image',maxCount:1},{name:'video',maxCount:1},{name:'',maxCount:1}]),createRecipe);
    app.post('/api/addRecipesMeta',upload.any(),createRecipeMeta);
    app.get('/api/v1/getallrecipes',getAllRecipe);
    app.get('/api/recipeDetails', visitedRecipeNumberOfTime);
    app.delete('/api/deleteMeta',deleteRecipeMeta)
    app.get('/api/popularRecipes',populerRecipe)
}