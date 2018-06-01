import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import TrackList from '../TrackList/TrackList';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={searchResults: [],
       playlistName:'',
       playlistTracks: []
  }
this.addTrack = this.addTrack.bind(this);
this.removeTrack = this.removeTrack.bind(this);
this.updatePlaylistName = this.updatePlaylistName.bind(this);
this.savePlaylist = this.savePlaylist.bind(this);
this.search = this.search.bind(this);
}

search(term)
{
  Spotify.search(term).then(tracks=>{
    this.setState({searchResults: tracks});
  })
}

addTrack(track){
if(this.state.playlistTracks.find(currentPlaytrack=>currentPlaytrack.id===track.id))
{
  return ;
}
else
{
  let tracks=this.state.playlistTracks;
  tracks.push({
  name:track.name,
  artist: track.artist,
  album: track.album,
  id:track.id});
  this.setState({playlistTracks: tracks});

}}

removeTrack(track)
{
const tracks = this.state.playlistTracks.filter(currentTrack=>{
return currentTrack.id !==track.id})
this.setState({playlistTracks: tracks});
}

updatePlaylistName(newName)
{
  this.setState({playlistName: newName});
}

savePlaylist()
{
  let trackURIs = [];
  this.state.playlistTracks.map(track=>
    {trackURIs.push(track.uri)}
  )
  Spotify.savePlaylist(this.state.playlistName,this.state.playlistTracks);
this.setState({playlistTracks:[]});
this.setState({playlistName:'New Playlist'});
}
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        {<SearchBar onSearch = {this.search}/>}
          <div className="App-playlist">
            {<SearchResults searchResults= {this.state.searchResults} onAdd = {this.addTrack}/> }
            {<Playlist onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
            playlistName = {this.state.playlistName}
            playlistTracks = {this.state.playlistTracks}
            onSave = {this.savePlaylist}/>}

          </div>
        </div>
      </div>
    );
  }
}


export default App;
