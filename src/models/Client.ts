import { prop, getModelForClass } from '@typegoose/typegoose';

class Client {
    /**es necesario declarar con un prop el tipado ya que 
     * de otra manera no lo ad mitira Typescript 
     * y es necesario agregar : "experimentalDecorators": true
     * al tsconfig en esete caso
     */
    @prop({ type: () => String })
    public name?: String;

    @prop({ type: () => String })
    public email?: String;

    @prop({ type: () => Date, default: new Date() })
    public createdAt?: Date;
}

const ClientModel = getModelForClass(Client);

export default ClientModel;