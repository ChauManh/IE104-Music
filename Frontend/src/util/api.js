import axios from 'axios';

const createUser = async (name, email, password) => {
    try {
        const result = await axios.post("http://localhost:3000/v1/api/register", {
            name: name,
            email: email,
            password: password,
            role: "user"
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export { createUser };