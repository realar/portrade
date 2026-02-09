import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white tracking-tight">Portrade</div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ведущая B2B платформа для совместных закупок. Мы помогаем малому бизнесу получать лучшие цены от проверенных поставщиков напрямую с фабрик.
            </p>
            <div className="flex space-x-4 pt-4">
              <Link href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Компания</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary-400 transition-colors">О нас</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Вакансии</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Партнерам</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Блог</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Help & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Помощь и Право</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Частые вопросы (FAQ)</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Доставка и оплата</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Возврат товара</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Пользовательское соглашение</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="#" className="hover:text-primary-400 transition-colors">Оферта</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-6">Контакты</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <div className="font-medium text-white mb-1">8 (800) 555-35-35</div>
                  <div className="text-xs text-gray-500">Пн-Вс: 9:00 - 21:00</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-500 mt-0.5" />
                <a href="mailto:support@portrade.com" className="hover:text-white transition-colors">support@portrade.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <span>г. Москва, Пресненская наб., 12, Башня Федерация, офис 34</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>&copy; 2026 Portrade Global Ltd. Все права защищены.</div>
          <div className="flex gap-6">
            <span>ИНН: 7700000000</span>
            <span>ОГРН: 1027700000000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
