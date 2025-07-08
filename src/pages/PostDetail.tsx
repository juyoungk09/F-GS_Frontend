import type { Component } from "solid-js";
import { useParams } from '@solidjs/router';
const PostDetail: Component = () => {
    const params = useParams();
    return (
        <div>
            <h1>PostDetail {params.id}</h1>
        </div>
    );
};

export default PostDetail;
