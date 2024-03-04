import React from 'react'
import { Home, About, Leaderboard, Login, Profile, Settings, Subscribe, Play, Tournaments } from './CustomWindows.jsx'

function MainFrame({ profileId, setProfileId, myProfile, setMyProfile, game, setGame, tournamentId, setTournamentId, tournaments, setTournaments }) {

    return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{backgroundImage: 'url("/images/'.concat(game, '.gif")'), backgroundSize: '100%'}}>
                <Home myProfile={myProfile} />
                <About />
                <Leaderboard setProfileId={setProfileId} game={game} />
                <Login setMyProfile={setMyProfile} setProfileId={setProfileId} setGame={setGame} />
                <Profile profileId={profileId} setProfileId={setProfileId} myProfile={myProfile} setMyProfile={setMyProfile} game={game} />
                <Settings myProfile={myProfile} setMyProfile={setMyProfile} setGame={setGame} />
                <Subscribe setMyProfile={setMyProfile} setProfileId={setProfileId} setGame={setGame} />
                <Play myProfile={myProfile} setMyProfile={setMyProfile} game={game} setGame={setGame} setProfileId={setProfileId} setTournamentId={setTournamentId} />
                <Tournaments tournamentId={tournamentId} setTournamentId={setTournamentId} setProfileId={setProfileId} myProfile={myProfile} game={game} />
            </div>
    )
}

export default MainFrame