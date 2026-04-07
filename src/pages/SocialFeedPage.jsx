import { useState } from "react";
import { MOCK_POSTS } from "../data/mockData";

const SocialFeedPage = ({ changePage }) => {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleLike = (id) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  return (
    <div className="social-layout">
      <div className="social-sidebar">
        <button className="sidebar-link" onClick={() => changePage("landing")}>
          ← INICI
        </button>
        <div style={{ borderBottom: "2px solid black", margin: "1rem 0" }}></div>
        <button className="sidebar-link">ROB_THE_FAB</button>
        <button className="sidebar-link">MISSATGES (3)</button>
        <button className="sidebar-link">DESCOBREIX</button>
        <button className="sidebar-link">LOOKS DESATS</button>
        <button className="sidebar-link" style={{ marginTop: "auto", color: "gray" }}>
          SETTINGS
        </button>
      </div>

      <div className="social-feed">
        {posts.map((post) => (
          <div key={post.id} className="social-post">
            <div className="post-header">
              <div className="user-avatar"></div>
              <span>@{post.user}</span>
            </div>
            <img
              src={post.img}
              alt={`Publicacio de ${post.user}`}
              className="post-img"
            />
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
              <button>💬 COMENTA</button>
              <button className="shop-look-btn">🛒 SHOP AQUEST LOOK</button>
            </div>
            <div style={{ padding: "0 1.5rem 1.5rem 1.5rem", fontSize: "1.1rem" }}>
              <strong>{post.user}</strong> {post.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeedPage;
