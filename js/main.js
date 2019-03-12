const BASE_URL = 'https://murmuring-atoll-51852.herokuapp.com/api/v2';
var office_ids = [];


function getToken(){
    token = localStorage.getItem('token');
    if(token)
        return token;
    else if (user.admin == false) {
                window.location.replace('login.html');
            }
            else {
                window.location.replace('../user/login.html');
            }
    return null
}

function tokenError(status){
    if(status === 401){
        window.location.replace('login.html')
        return true;
    }
    return false;
}

function createNode(type, id){
    const node = document.createElement(type);
    node.id = id;
    return node;
}
function displaySuccess(msg){
    document.getElementById('snackbar').innerText = msg
    document.getElementById('snackbar').style.backgroundColor = '#1abc9c';
    showSnackbar();
}
function displayError(msg){
    document.getElementById('snackbar').innerText = msg
    document.getElementById('snackbar').style.backgroundColor = '#d32f2f';
    showSnackbar();
}
function showSnackbar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
/**
 * Signup function
 */
function onSignup() {
    password = document.getElementById('password').value
    confirm_password = document.getElementById('confirm_password').value

    if (password !== confirm_password){
        displayError('Passwords do not match')
        return;
    }

    let payload = {
        firstname: document.getElementById('first_name').value,
        lastname: document.getElementById('last_name').value,
        national_id: document.getElementById('national_id').value,
        admin: false,
        email: document.getElementById('email').value,
        password: password,
    }

    fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then((data) => {

        console.log(data);
        if (data.status === 201) {
            var user = data.data[0].user

            // Save user profile to local storage
            localStorage.setItem('token', data.data[0].token);
            localStorage.setItem('firstname', user.firstname);
            localStorage.setItem('lastname', user.lastname);
            localStorage.setItem('email', user.email);
            localStorage.setItem('admin', user.admin);
            localStorage.setItem('uid', user.id);
            // Redirect to login after successful signup
            window.location.replace('login.html');

        }else {
            displayError(data.error)
            console.log(data.status);
        }

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

/**
 * Login function
 */
function onLogin() {
   
    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        }),
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 200) {
            var user = data.data[0].user

            // Save user profile to local storage
            localStorage.setItem('token', data.data[0].token);
            localStorage.setItem('firstname', user.firstname);
            localStorage.setItem('lastname', user.lastname);
            localStorage.setItem('email', user.email);
            localStorage.setItem('national_id', user.national_id);
            localStorage.setItem('admin', user.admin);
            localStorage.setItem('uid', user.id);
            // Redirect to homepage after successful login
            if (user.admin == false) {
                window.location.replace('vote.html');
            }
            else {
                window.location.replace('../admin/admin-dash.html');
            }

        }else {
            displayError(data.error)
            console.log(data.status);
        }   

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

/**
 * Create office function
 */
function createOffice(){
    fetch(`${BASE_URL}/offices`, {
        method: 'POST',
        headers:{
            'Content-type':'application/json',
            'authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            category: document.getElementById('category').value
        })
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 201) {

            displaySuccess('Office created successfully')
            
            setTimeout(function(){
                 window.location.replace('admin-dash.html')
            }, 2000);

        }else {
            displayError(data.error)
            console.log(data.status);
        }

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

/**
 * Create party function
 */

function createParty() {

    fetch(`${BASE_URL}/parties`, {
        method: 'POST',
        headers:{
            'Content-type':'application/json',
            'authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            name: document.getElementById('party_name').value,
            hqaddress: document.getElementById('hqaddress').value
        })
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 201) {

            displaySuccess('Party created successfully')
            
            setTimeout(function(){
                 window.location.replace('admin-dash.html')
            }, 2000);

        }else {
            displayError(data.error)
            console.log(data.status);
        }

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

function viewParties() {

    fetch(`${BASE_URL}/parties`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        }
    })
    .then(res => res.json())
    .then((data) => {
        
        if (data.status === 200) {

            parties = document.getElementById('party-list');

            data.data.forEach(function(party){

                let party_node = createNode('div', party.id);

                party_node.innerHTML = `
   	                <div class="content-section">
                        <div class="media">
	                        <img class="rounded-circle account-img" src="images/default.jpg">
	                        <div class="media-body">
		                        <legend class="border-bottom mb-4">${party.id}.${party.name}</legend>
                                <p class="text-secondary">${party.hqaddress}</p>
                            </div>
                            <form onsubmit="editParty(${party.id});return false;">
                                <div class="form-group">
                                    <input class="btn btn-outline-info" id="submit_edit" name="submit" type="submit" value="Edit">
                                </div>
                            </form>
                            </div>
                            <form onsubmit="deleteParty(${party.id});return false;">
                                <div class="form-group">
                                    <input class="btn-red btn-outline-info-red" id="submit_delete" name="submit" type="submit" value="Delete">
                                </div>
                            </form>
	                    
	                 </div>
                `
                parties.appendChild(party_node);

            });

        }else if(tokenError(data.status)){
            console.log('Expired token')
        }else {
            displayError(data.error);
            console.log(data.status);
        }

    })
    .catch((error) => {
        displayError('Please check your connection') 
    });
}

function viewOffices() {

    fetch(`${BASE_URL}/offices`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        }
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 200) {

            var offices = document.getElementById('office-list');

            data.data.forEach(function(office){

                let office_node = createNode('div', office.id);

                office_node.innerHTML = `
   	                <div class="content-section">
                        <div class="media">
	                        <img class="rounded-circle account-img" src="images/default.jpg">
	                        <div class="media-body">
		                        <legend class="border-bottom mb-4">${office.id}.${office.name}</legend>
                                <h2>${office.category}</h2>
                                <form onsubmit="castVote(id,${office.id}); return false;">
                                <select name="candidate_g" id="candidate-list-${office.id}">
                                <option value=""></option>
                                </select>
			                    <br><br>
			                    <input type="submit">
                                </form>
		                    </div>
	                    </div>
	                 </div>
                `
                offices.appendChild(office_node);

                initVotePage(office.id)

            });

        }else if(tokenError(data.status)){
            console.log('Expired token')
        }else {
            displayError(data.error);
            console.log(data.status);
        }

    })
    .catch((error) => {
        displayError('Please check your connection') 
    });
}

function initHomePage(){
    viewOffices();
    viewParties();
 }

 /** 
* Profile
*/
function userProfile(){
    document.getElementById('firstname').innerText = localStorage.getItem('firstname')
    document.getElementById('national_id').innerText = localStorage.getItem('national_id')
    document.getElementById('email').innerText = localStorage.getItem('email')
   /**  document.getElementById('firstname_p').innerText = localStorage.getItem('firstname')
    document.getElementById('firstname_g').innerText = localStorage.getItem('firstname')
    document.getElementById('firstname_m').innerText = localStorage.getItem('firstname')
    */
}

function registerCandidate() {

    let payload = {
        office: parseInt(document.getElementById('candidate_office').value),
        party: parseInt(document.getElementById('candidate_party').value),
        candidate: parseInt(document.getElementById('candidate_name').value)
    }

    fetch(`${BASE_URL}/offices/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 201) {
            
            displaySuccess(data.message)

        }else {
            displayError(data.error)
            console.log(data);

        }

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

function initVotePage(office_id) {
    
    fetch(`${BASE_URL}/offices/${office_id}/candidates`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        }
    })
    .then(res => res.json())
    .then((data) => {
        
        if (data.status === 200) {

            var candidates = document.getElementById(`candidate-list-${office_id}`);
            console.log(candidates)

            data.data.forEach(function(candidate){

                let candidate_node = createNode('option', candidate.id);
                
                candidate_node.innerHTML = `
                <option value=""></option>
                <option value="">${candidate.id}.${candidate.candidate}</option>
                `                
                candidates.appendChild(candidate_node);
                //castVote(candidate.id,office_id);
            });

        }else if(tokenError(data.status)){
            console.log('Expired token')
        }else {
            displayError(data.error);
            console.log(data.status);
            console.log(data);
        }

    })
    .catch((error) => {
        displayError('Please check your connection')
        console.log(error);
    });
}

function castVote(id, office_id) {

    let payload = {
        office: parseInt(`${office_id}`),
        candidate: parseInt(document.getElementById(`candidate-list-${office_id}`).value)
    }
    console.log(payload);

    fetch(`${BASE_URL}/votes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 201) {
            console.log(data);

            
            displaySuccess(data.message);
            console.log(data);
            viewOfficeResults(`${office_id}`);

        }else {
            displayError(data.error)
            console.log(data);
            viewOfficeResults(`${office_id}`);


        }
        


    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

function viewOfficeResults(office_id = null) {
    if (office_id==null){
        office_id = sessionStorage.getItem('result_office_id');
    }else{
        sessionStorage.setItem('result_office_id',office_id);
        setTimeout(function(){
            window.location.replace('results.html')
        }, 100);
            return ;

    }
    if(office_id==null){
        displayInfo('No office selected');
        return;
    }

    fetch(`${BASE_URL}/offices/${office_id}/result`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        }
    })
    .then(res => res.json())
    .then((data) => {
        
        if (data.status === 200) {
            


            var results = document.getElementById('result-list');
            data.data.forEach(function(result){
                console.log(result);
            
                let result_node = createNode('div', result.candidate);
            
                result_node.innerHTML = `
   	                <div class="content-section">
                        <div class="media">
	                        <img class="rounded-circle account-img" src="images/default.jpg">
	                        <div class="media-body">
		                            <legend class="border-bottom mb-4">${result.office}</legend>
	                                <h2>${result.candidate}</h2>
		                            <p class="text-secondary">${result.party}</p>
                                    <p class="text-secondary">${result.results} votes </p>
		                    </div>
	                    </div>
	                </div>
                `
                results.appendChild(result_node);

            });

            if(data.data.length === 0){
                displayInfo('No results for selected office')
            }

        }else if(tokenError(data.status)){
            console.log('Expired token')
        }else {
            displayError(data.error);
            console.log(data);
        }

    })
    .catch((error) => {
        console.log(error);
    });
}

function deleteParty(party_id){
    console.log(party_id);
    if(!party_id) return;
    

    fetch(`${BASE_URL}/parties/${party_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        }
    })
    
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        if (data.status === 200) {
            console.log(data);
            if (!confirm("You are about to delete this party")) {
                
            
                displaySuccess('Party Deleted')
                setTimeout(function(){
                    window.location.replace('create.html')
                }, 5000)
                return;
            }
            
            
        }else if(tokenError(data.status)){
            console.log('Expired token')
        }else {
            displayError(data.error);
            console.log(data.status);
        }

    })
    .catch((error) => {
        
    });
}

function editParty(party_id){
    if(!party_id) return;
    
    var new_name = prompt("Please enter new party name:", "New Name");
    if (new_name != null){
        let payload = {
            name: new_name
        }
    
    console.log(payload);
   
    fetch(`${BASE_URL}/parties/${party_id}/name`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
    })
    
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        if (data.status === 200) {
            console.log(data)
                
            
            displaySuccess('Party Edited')
            setTimeout(function(){
                window.location.replace('create.html')
            }, 5000);
            
            
        }else if(tokenError(data.status)){
            console.log('Expired token')
        }else {
            displayError(data.error);
            console.log(data.status);
        }

    })
    .catch((error) => {
        
    });
}
}

function onResetPassword() {

    let email = document.getElementById('email').value;
   
    fetch(`${BASE_URL}/auth/reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email
        }),
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 200) {

            displaySuccess(data.data[0].message);

        }else {
            displayError('Please provide a valid email');
        }

    })
    .catch((error) => {
        displayError('Please check your connection');
    });
}

function resetPassword() {

    let password = document.getElementById('password').value
    let confirm_password = document.getElementById('confirm_password').value
    if (password !== confirm_password){
        displayError('Passwords do not match');
        return;
    }

    let token = location.search.replace("?token=", "");
    
    let payload = {
        password: password
    }

    fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then((data) => {

        if (data.status === 200) {

            displaySuccess('Your password has been updated')
            
            setTimeout(function(){
                 window.location.replace('login.html')
            }, 2000);

        }else {
            displayError(data.error)
        }

    })
    .catch((error) => {
        displayError('Please check your connection')
    });
}

function viewVotingHistory() {

    fetch(`${BASE_URL}/voting-history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getToken()}`
        }
    })
    .then(res => res.json())
    .then((data) => {        

        if (data.status === 200) {
            results = document.getElementById('voting-history');

            data.data.forEach(function(result){

                let result_node = createNode('div', '');
                
                result_node.innerHTML = `
   	                <div class="content-section">
                        <div class="media">
	                    <img class="rounded-circle account-img" src="images/default.jpg">
	                        <div class="media-body">
		                    <legend class="border-bottom mb-4">${result.office}</legend>
	                        <h2>${result.candidate}</h2>
		                    <p class="text-secondary">${result.party}</p>
		                </div>
	                </div>
                `
               
                results.appendChild(result_node);

            });

            if(data.data.length == 0){
                let notyet = createNode('h3', 'not-yet');
                notyet.innerText ='You have not voted for any candidate yet'
                results.appendChild(notyet);
            }

        }else if(tokenError(data.status)){
            console.log('Expired token')
        }else {
            displayError(data.error);
            console.log(data.status);
        }

    })
    .catch((error) => {
        
    });
}