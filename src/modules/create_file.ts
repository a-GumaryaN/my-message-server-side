import { existsSync, mkdirSync } from "fs-extra";
import { join } from 'path';
const create_file = ({ _id }: { _id: string }) => {
    if (!existsSync(join(__dirname, '..', 'uploads', 'users', _id))) {
        mkdirSync(join(__dirname, '..', 'uploads', 'users', _id));
        console.log('directory made...')
    }
}


export default create_file;