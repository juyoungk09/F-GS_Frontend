type User = {
    created_at: string,
    email: string,
    id: number,
    is_active: boolean,
    is_admin: boolean,
    is_will_deleted: boolean,
    name: string,
    password: string,
    portfolio_path: string,
    profile_path: string,
    rating: number,
    self_introduction: string,
    student_id: number,
    tags: Tag[]
}
type UserInform = Pick<User, "id" | "name" | "email" | "profile_path" | "rating" | "created_at" | "portfolio_path" | "student_id" | "self_introduction">
    