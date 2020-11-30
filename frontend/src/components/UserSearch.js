import { useState } from 'react';
import { getAccount } from '../api';

export default function UserSearch() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState();
  return (<>
    <h2>User Search</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      setSearchResults(undefined);
      getAccount(search).then(val => setSearchResults(val));
    }}>
      <input type="text" placeholder="username" value={search} onChange={e => setSearch(e.target.value)}/>
      <input type="submit" value="Search" />
    </form>
    { searchResults && searchResults.map(({name, emoji }) => 
      <p key={name}>
       {emoji} {name}
      </p>
    )}
    { searchResults && searchResults.length === 0 && 
        <p>Nothing found.</p>
    }
  </>);
}

