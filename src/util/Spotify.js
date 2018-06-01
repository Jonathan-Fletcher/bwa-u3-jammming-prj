let token = '';
const client_id = '4e097dcaa04647c79fb63614110dd9e7';
const redirectURI = "http://localhost:3000/";
const Spotify = {

search(term){

  let accessToken = this.getAccessToken(token);
  return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
  {headers: {Authorization: `Bearer ${accessToken}`}}).then(response=>
  {return response.json()}
).then(responsejson=>{
  if(responsejson.tracks)
  {
    return responsejson.tracks.items.map(track=>({
      id: track.id,
      name: track.name,
      artist:track.artists[0].name,
      album:track.album.name,
      uri:track.uri
    })
    )
  }
})
},
savePlaylist(playlistName,tracks){
  if(!playlistName || !tracks)
  {
    return;
  }
  let spotTracks =tracks.map(track=>{
    return "spotify:track:"+track.id
  });
  spotTracks ={uris: spotTracks};
  const nameObj = {name: playlistName};
  let userID ='';
  const header = {headers: {Authorization: `Bearer ${token}`}};
  fetch("https://api.spotify.com/v1/me",header)
  .then(response=>{
      return response.json()})
      .then(responsejson=>{
        userID = responsejson.id;
       return responsejson.id;
     }).then(user_id=>
       fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`,{
         body:JSON.stringify(nameObj),
     headers:{
       "Content-Type": "application/json",
     Authorization: `Bearer ${token}`
   },
   method: 'POST'
 }).then(response=>{
      return response.json()
     }).then(jsonResponse=>{
       const play_id = jsonResponse.id;
       return jsonResponse.id;
     }).then(playlist_id =>fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlist_id}/tracks`,{
       headers:{
         "Content-Type": "application/json",
       Authorization: `Bearer ${token}`
     },
     body: JSON.stringify(spotTracks),
     method: 'POST'

   })))


},


getAccessToken(access_token){

  if(access_token !='')
  {
    token =access_token;
    return access_token;
  }
  else if(window.location.href.match(/access_token=([^&]*)/))
  {
    let access=window.location.href.match(/access_token=([^&]*)/);
    const expiresIn=window.location.href.match(/expires_in=([^&]*)/);
    access_token = access[0].substring(13);
    window.setTimeout(() => access_token = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');
    token =access_token;

    return access_token;
  }
  else if(!window.location.href.match(/access_token=([^&]*)/) && access_token==''){
    window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
  }
}
};


export default Spotify;
