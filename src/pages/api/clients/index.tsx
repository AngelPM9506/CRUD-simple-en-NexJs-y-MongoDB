import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import ClientModel from 'src/models/Client';
import dbconnection from 'src/services/dbConnection'

dbconnection();


const Index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  await NextCors(req, res, {
    /**options */
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200
  });
  try {
    switch (method) {
      case 'GET':
        const clients = await ClientModel.find({});
        return res.status(200).json({ status: 'success', data: clients });
      case 'POST':
        let { body: { name, email } } = req;
        if (!name || !email) return res.status(404).json({ status: 'error', msg: 'Data Missing' })
        let newClient = await ClientModel.create({ name, email });
        return res.status(201).json({ status: 'success', newClient });
      default:
        return res.status(404).json({ status: 'error', msg: 'Method unsuported' });
    }
  } catch (error: any) {
    res.json({ error: error })
  }
}

export default Index;