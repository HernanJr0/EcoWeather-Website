import { Pagination, A11y, EffectCreative } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

import Atalho from '../Atalho/Atalho.jsx'
import Previsao from '../Previsao/Previsao.jsx'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

import './cu.css';

const swiper = () => {
    return (
        <Swiper
            // install Swiper modules
            modules={[Pagination, A11y, EffectCreative]}
            pagination={{
                clickable: true
            }}
            loop={true}
            grabCursor={true}
            slidesPerView={1}
            spaceBetween={15}
            parallax={true}
            /*Swiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}*/

            effect={'creative'}
            /*cardsEffect={{
                slideShadows: true,
                perSlideOffset: 8,
                perSlideRotate: 0
            }}*/
            creativeEffect={{
                prev: {
                    translate: [-200, 0, -400],
                },
                next: {
                    translate: [200, 0, -400],
                },
            }}

        >

            <SwiperSlide>
                <Previsao />
            </SwiperSlide>

            <SwiperSlide>
                <Atalho
                    titulo={'Dicas'}
                    descricao={'Veja aqui dicas de como cuidar do meio ambiente com pequenas ações no dia a dia'}
                    imagem={'https://cdn-icons-png.flaticon.com/512/361/361892.png'}
                    link={'/Dicas'}
                />
            </SwiperSlide>

            <SwiperSlide>
                <Atalho
                    titulo={'Agenda'}
                    descricao={'Planeje seus eventos, atividade ou lembretes em um só lugar'}
                    imagem={'https://cdn-icons-png.flaticon.com/512/363/363485.png'}
                    link={''}
                />
            </SwiperSlide>

        </Swiper >
    )

}
export default swiper