import {
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Table,
  Thead,
  Tbody,
  Td,
  Th,
  Tr,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react"
import { NextPage } from "next"
import { isValidElement, SyntheticEvent, useEffect, useRef, useState } from "react"
import Header from "src/componentes/header"
import api, { pruebaApi } from "src/services/api"

type lastClient = { [x: string]: any }
const Home: NextPage = () => {
  const initLast: lastClient = {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState(null);
  const [clients, setClients] = useState([]);
  const [lastClient, setLastClient] = useState(initLast);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const makeToast = (msg: string, sta: "info" | "warning" | "success" | "error" | "loading") => {
    return toast({
      title: msg,
      status: sta,
      duration: 5000,
      isClosable: true
    });
  }

  const getAllClientsRegisterd = async () => {
    let { data: { data } }: any = await api.get('/clients');
    //console.log(data);
    setClients(data)
  }
  useEffect(() => {
    //console.log(pruebaApi);
    getAllClientsRegisterd();
  }, []);

  const isNotValidFormData = () => {
    let regularMail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let regularOnlyLetters = /^[Á-Źa-z\s]+$/i;
    if (!name || !regularOnlyLetters.test(name)) return makeToast('El campo nombre esta vacío o es inválido', "error");
    if (!email || !regularMail.test(email)) return makeToast('El campo E-mail esta vacío o es inválido', "error");
    if (clients.some((client: any) => client.email === email && client._id !== id)) {
      return makeToast(`Ya hay un cliente registrado cone le email ${email}`, 'error');
    }
  }

  const newClient = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (isNotValidFormData()) return;
    if (clients.length >= 100) {
      makeToast('Solo se admite un maximo de 100 registros', 'error');
      return;
    }
    try {
      setIsLoading(true);
      let { data: { newClient } }: any = await api.post('/clients', { name: name.trim(), email: email.trim() });
      setClients([...clients, newClient]);
      setLastClient(newClient);
      setName('');
      setEmail('');
      setIsLoading(false);
      setIsFormOpen(!isFormOpen)
      makeToast('Cliente Agregado exitosamente', 'success');
    } catch (error) {
      setIsLoading(false);
      makeToast('Error al enviar cliente Intenta de nuevo', 'error');
    }
  }

  const deleteClient = async (id: string) => {
    if (clients.length <= 1) {
      makeToast('Debe de haber al menos un cliente en todo momento', 'error');
      return;
    }
    let { data } = await api.delete(`/clients/${id}`);
    setLastClient(data);
    makeToast('Cliente Eliminado correctamente', 'success');
    getAllClientsRegisterd();
  }

  const updateClient = async () => {
    if (isNotValidFormData()) return;
    let { data } = await api.put(`/clients/${id}`, { name: name.trim(), email: email.trim() });
    setLastClient(data);
    onClose();
    setName('');
    setEmail('');
    setId('');
    setIsLoading(false);
    makeToast('Cliente Actualizado correctamente', 'success');
    getAllClientsRegisterd();
  }

  const helperToOpenModal = (data: any) => {
    setIsFormOpen(false);
    setName(data.name);
    setEmail(data.email);
    setId(data._id);
    onOpen()
  }

  return (
    <Box height={'100vh'} display={'flex'} flexDirection={'column'}>
      <Header />
      <Flex justifyContent='center' gap={'1rem'} flex={'1 0 0'}>

        {/* informacion de datos */}
        <Flex flexDirection={'column'} width={500} borderWidth={1} borderRadius={8} boxShadow={'lg'} p={10} m={"1.5rem 0"}>
          <Heading as={'h2'}>Datos en proceso</Heading>
          {isFormOpen ?
            <Grid gridTemplateRows={'repeat(2, 1fr)'} gap={'1rem'} borderBottomWidth={1} padding={'0.4rem 0'}>
              <Flex textAlign={'center'} gap={2} align={'center'}>
                <Text flex={'0 0 100px'}>Nombre:</Text>
                <Text flex={'1'} fontWeight={'bold'} borderWidth={1} borderRadius={8} padding={1}>{name}</Text>
              </Flex>
              <Flex textAlign={'center'} gap={2} align={'center'}>
                <Text flex={'0 0 100px'}>E-mail:</Text>
                <Text flex={'1'} fontWeight={'bold'} borderWidth={1} borderRadius={8} padding={1}>{email}</Text>
              </Flex>
            </Grid> : null}
          <Flex gap={'0.2rem'} borderBottomWidth={1} padding={'0.4rem 0'} flexDirection={'column'}>
            <Text alignItems='center'>Ultima respuesta del api JSON:</Text>
            <Code as={'pre'} flex={'1 0 0'} padding={3} fontSize='0.7rem'>
              {JSON.stringify(lastClient, null, 2)}
            </Code>
          </Flex>
          <Flex gap={'0.2rem'} flex={'1'} borderBottomWidth={1} padding={'0.4rem 0'} flexDirection={'column'}>
            <Text alignItems='center'>Clientes JSON:</Text>
            <Code as={'pre'} flex={'1 0 0'} overflow={'scroll'} padding={3} fontSize='0.7rem'>
              {JSON.stringify(clients, null, 2)}
            </Code>
          </Flex>
        </Flex>

        {/* app  */}
        <Flex flexDirection={'column'} width={800} borderWidth={1} borderRadius={8} boxShadow={'lg'} p={10} m={"1.5rem 0"} >

          <Flex justifyContent={'space-between'} marginBottom='2rem'>
            <Heading as={'h2'}>Registro de Clientes</Heading>
            <Button colorScheme={'blue'} onClick={() => { setIsFormOpen(!isFormOpen) }}>{isFormOpen ? 'Cerrar' : 'Abrir'}</Button>
          </Flex>
          {/* Formulario solo se abre en caso de seleccionar el boton*/}
          {isFormOpen ?
            <VStack as={'form'} onSubmit={newClient}>
              <FormControl display={'flex'} alignItems={'center'}>
                <FormLabel flex={'0 0 70px'} margin='0'>Name: </FormLabel>
                <Input flex={'1'} type={'text'} placeholder="Digita tu nombre" value={name}
                  onChange={event => setName(event.target.value)} />
              </FormControl>

              <FormControl display={'flex'} alignItems={'center'}>
                <FormLabel flex={'0 0 70px'} margin='0'>E-mail: </FormLabel>
                <Input flex={'1'} type={'email'} placeholder="Digita tu Correo electronico" value={email}
                  onChange={event => setEmail(event.target.value)} />
              </FormControl>

              <FormControl display={'flex'} flexDirection={'row-reverse'}>
                <Button colorScheme={'blue'} type='submit' mt={6} isLoading={isLoading}>Registrar</Button>
              </FormControl>
            </VStack> : null}

          {/* Tabla de Clientes  justifyContent={'space-between'} borderBottom='2px solid darkBlue'*/}
          <Table variant={'simple'} mt={6} flex={'1'} display={'flex'} flexDirection={'column'}>
            <Thead bg={'blue.700'}>
              <Tr display={'flex'} >
                <Th textColor={'white'} flex={'1'} textAlign={'center'}>Name</Th>
                <Th textColor={'white'} flex={'1'} textAlign={'center'}>E-mail</Th>
                <Th textColor={'white'} flex={'1'} textAlign={'center'}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody flex={'1 0 0'} overflow={'scroll'}>
              {clients && clients.map((client: any, i: number) => {
                let { name, email, _id } = client;
                return (
                  <Tr key={i} display={'flex'} justifyContent={'space-between'}>
                    <Td flex={'1'} display={'flex'} textAlign={'center'} p={'0.5rem 1rem'}
                      justifyContent={'center'} alignItems={'center'}>{name}</Td>
                    <Td flex={'1'} display={'flex'} textAlign={'center'} p={'0.5rem 1rem'}
                      justifyContent={'center'} alignItems={'center'}>{email}</Td>
                    <Td flex={'1'} display={'flex'} textAlign={'center'} p={'0.5rem 1rem'}
                      justifyContent={'center'} alignItems={'center'}>
                      <Flex justifyContent={'space-evenly'}>
                        <Button size={'sm'} boxShadow='sm' fontSize='sm' colorScheme={'yellow'} mr='2'
                          onClick={() => { helperToOpenModal(client) }}>Editar</Button>
                        <Button size={'sm'} boxShadow='sm' fontSize='sm' colorScheme={'red'} mr='2' onClick={() => deleteClient(_id)}>Eliminar</Button>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign={'center'}>Actualiza los datos del Cliente</ModalHeader>
            <ModalBody>
              <VStack as={'form'}>
                <FormControl display={'flex'} alignItems={'center'}>
                  <FormLabel flex={'0 0 70px'} margin='0'>Name: </FormLabel>
                  <Input flex={'1'} type={'text'} placeholder="Digita tu nombre" value={name}
                    onChange={event => setName(event.target.value)} />
                </FormControl>

                <FormControl display={'flex'} alignItems={'center'}>
                  <FormLabel flex={'0 0 70px'} margin='0'>E-mail: </FormLabel>
                  <Input flex={'1'} type={'email'} placeholder="Digita tu Correo electronico" value={email}
                    onChange={event => setEmail(event.target.value)} />
                </FormControl>
              </VStack>
              <ModalFooter>
                <Flex flexDirection={'row-reverse'} gap={'0.5rem'}>
                  <Button colorScheme={'blue'} onClick={updateClient} mt={6} isLoading={isLoading}>Guardar</Button>
                  <Button colorScheme={'gray'} onClick={() => onClose()} mt={6}>Cancelar</Button>
                </Flex>
              </ModalFooter>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  )
}

export default Home
