
type Tag = {
    id: number;
    name: string;
    bg_color: string;
    font_color: string;
    tag_type: string;
    usage: number;
};

type Post = {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
    updated_at: string;
    deadline: string;
    is_finished: boolean;
    max_recruits: number;
    current_recruits: number;
    author: User;
    tags: Tag[];
    recruiters: User[];
};