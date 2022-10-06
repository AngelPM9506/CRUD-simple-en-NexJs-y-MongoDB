import { Heading, Flex } from '@chakra-ui/react';

const Header = () => {
    return (
        <Flex as='nav' align={'center'} justify='space-between' wrap={'wrap'} padding={'0.5rem 0.5rem'} bg='blue.500' color={'white'}>
            <Flex align={'center'} mr={5}>
                <Heading as='h1' size={'lg'} letterSpacing={'tighter'}>Vista Clientes</Heading>
            </Flex>
            <Flex>

            </Flex>
        </Flex>
    )
}

export default Header