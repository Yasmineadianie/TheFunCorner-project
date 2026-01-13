class IndexController{
    openHome = (req, res) => {                 
        res.render('index');                
    }

    openAbout = (req, res)=>{
        res.render('about');
    }


}

module.exports = new IndexController();

