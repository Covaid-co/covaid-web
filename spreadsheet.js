var geocoding = new require('reverse-geocoding');
var config = {
    'latitude': 40.00403611111111,
    'longitude': 116.48485555555555, 
    'key': "AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY"
};
geocoding(config, function (err, data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});