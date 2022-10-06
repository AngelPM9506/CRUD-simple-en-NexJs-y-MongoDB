import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import ClientModel from 'src/models/Client';
import dbconnection from 'src/services/dbConnection'

dbconnection();


const Index = async (req: NextApiRequest, res: NextApiResponse) => {
    let { method, query: { id }, body: { name, email } } = req;
    await NextCors(req, res, {
        /**options */
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200
    });
    try {
        switch (method) {
            case 'GET':
                const getClient = await ClientModel.findById(id);
                return res.status(200).json({ status: 'success', data: getClient ? getClient : 'Unfounded' });
            case 'PUT':
                if (!name && !email) return res.status(404).json({ status: 'error', msg: 'Data Missing' })
                console.log('PUT Method');
                let upClient = await ClientModel.updateOne({ _id: id }, { name, email });
                return res.status(201).json({ status: 'success', upClient });
            case 'DELETE':
                let clientDelete = await ClientModel.deleteOne({ _id: id });
                return res.status(201).json({ status: 'success', clientDelete });
            default:
                return res.status(404).json({ status: 'error', msg: 'Method unsuported' });
        }
    } catch (error: any) {
        res.json({ error: error })
    }
}

export default Index;