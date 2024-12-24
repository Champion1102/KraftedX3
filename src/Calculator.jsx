import { useState, useEffect } from 'react';
import { FiDelete, FiClock, FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

function Calculator() {
    const navigate = useNavigate();
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [hasError, setHasError] = useState(false);
    const [lastNumber, setLastNumber] = useState('');
    const [lastOperator, setLastOperator] = useState('');
    const [isNewNumber, setIsNewNumber] = useState(true);
    const [isScientific, setIsScientific] = useState(false);
    const [isRadians, setIsRadians] = useState(true);
    const [memory, setMemory] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('calculatorTheme');
        return savedMode ? savedMode === 'dark' : true;
    });

    useEffect(() => {
        localStorage.setItem('calculatorTheme', isDarkMode ? 'dark' : 'light');
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key.match(/[0-9]|[\+\-\*\/\.]|Enter|Backspace|Escape/)) {
                event.preventDefault();
            }

            const getButton = (key) => {
                return document.querySelector(`button[data-key="${key}"]`);
            };

            const addKeyPressEffect = (button) => {
                if (button) {
                    button.classList.add('active');
                    setTimeout(() => button.classList.remove('active'), 100);
                }
            };

            switch (event.key) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '.':
                    handleNumber(event.key);
                    addKeyPressEffect(getButton(event.key));
                    break;
                case '+':
                    handleOperator('+');
                    addKeyPressEffect(getButton('+'));
                    break;
                case '-':
                    handleOperator('-');
                    addKeyPressEffect(getButton('-'));
                    break;
                case '*':
                    handleOperator('×');
                    addKeyPressEffect(getButton('×'));
                    break;
                case '/':
                    handleOperator('÷');
                    addKeyPressEffect(getButton('÷'));
                    break;
                case 'Enter':
                    handleEqual();
                    addKeyPressEffect(getButton('='));
                    break;
                case 'Backspace':
                    handleClear();
                    addKeyPressEffect(getButton('C'));
                    break;
                case 'Escape':
                    handleClear();
                    addKeyPressEffect(getButton('C'));
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, lastNumber, lastOperator]);

    const addToHistory = (equation, result) => {
        const historyItem = {
            equation,
            result,
            timestamp: new Date().toISOString(),
        };
        const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
        localStorage.setItem(
            'calculatorHistory',
            JSON.stringify([historyItem, ...history].slice(0, 100))
        );
    };

    const handleNumber = (number) => {
        if (hasError) {
            setDisplay(number);
            setHasError(false);
            setIsNewNumber(false);
            return;
        }

        if (isNewNumber) {
            setDisplay(number);
            setIsNewNumber(false);
        } else {
            setDisplay(display === '0' ? number : display + number);
        }
    };

    const handleDecimal = () => {
        if (hasError) return;

        if (isNewNumber) {
            setDisplay('0.');
            setIsNewNumber(false);
        } else if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const handleOperator = (operator) => {
        if (hasError) return;

        if (lastOperator && !isNewNumber) {
            handleEqual();
        }

        setLastNumber(display);
        setLastOperator(operator);
        setIsNewNumber(true);
        setEquation(`${display} ${operator}`);
    };

    const handleEqual = () => {
        if (hasError || !lastOperator) return;

        try {
            const current = parseFloat(display);
            const previous = parseFloat(lastNumber);
            let result;

            switch (lastOperator) {
                case '+':
                    result = previous + current;
                    break;
                case '-':
                    result = previous - current;
                    break;
                case '×':
                    result = previous * current;
                    break;
                case '÷':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    result = previous / current;
                    break;
                case '':
                    result = Math.pow(previous, current);
                    break;
                default:
                    return;
            }

            const formattedResult = parseFloat(result.toFixed(8)).toString();
            setDisplay(formattedResult);
            addToHistory(`${lastNumber} ${lastOperator} ${display}`, formattedResult);
            setEquation('');
            setLastOperator('');
            setIsNewNumber(true);
        } catch (error) {
            setDisplay('Error');
            setHasError(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setEquation('');
        setLastNumber('');
        setLastOperator('');
        setHasError(false);
        setIsNewNumber(true);
    };

    const handleDelete = () => {
        if (hasError || isNewNumber) return;

        if (display.length === 1) {
            setDisplay('0');
            setIsNewNumber(true);
        } else {
            setDisplay(display.slice(0, -1));
        }
    };

    const handleScientificOperation = (operation) => {
        if (hasError) return;

        try {
            let result;
            const currentNumber = parseFloat(display);

            switch (operation) {
                case 'sin':
                    result = isRadians ?
                        Math.sin(currentNumber) :
                        Math.sin(currentNumber * Math.PI / 180);
                    break;
                case 'cos':
                    result = isRadians ?
                        Math.cos(currentNumber) :
                        Math.cos(currentNumber * Math.PI / 180);
                    break;
                case 'tan':
                    result = isRadians ?
                        Math.tan(currentNumber) :
                        Math.tan(currentNumber * Math.PI / 180);
                    break;
                case 'asin':
                    result = isRadians ?
                        Math.asin(currentNumber) :
                        Math.asin(currentNumber) * 180 / Math.PI;
                    break;
                case 'acos':
                    result = isRadians ?
                        Math.acos(currentNumber) :
                        Math.acos(currentNumber) * 180 / Math.PI;
                    break;
                case 'atan':
                    result = isRadians ?
                        Math.atan(currentNumber) :
                        Math.atan(currentNumber) * 180 / Math.PI;
                    break;
                case 'sqrt':
                    result = Math.sqrt(currentNumber);
                    break;
                case 'square':
                    result = Math.pow(currentNumber, 2);
                    break;
                case 'cube':
                    result = Math.pow(currentNumber, 3);
                    break;
                case 'log':
                    result = Math.log10(currentNumber);
                    break;
                case 'ln':
                    result = Math.log(currentNumber);
                    break;
                case 'pi':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                case '1/x':
                    result = 1 / currentNumber;
                    break;
                case 'fact':
                    result = factorial(currentNumber);
                    break;
                default:
                    return;
            }

            const formattedResult = parseFloat(result.toFixed(8)).toString();
            setDisplay(formattedResult);
            addToHistory(`${operation}(${currentNumber})`, formattedResult);
            setIsNewNumber(true);
        } catch (error) {
            setDisplay('Error');
            setHasError(true);
        }
    };

    const factorial = (n) => {
        if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input');
        if (n === 0) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    };

    const handleMemory = (operation) => {
        const currentValue = parseFloat(display);

        switch (operation) {
            case 'MC':
                setMemory(0);
                break;
            case 'MR':
                setDisplay(memory.toString());
                setIsNewNumber(true);
                break;
            case 'M+':
                setMemory(memory + currentValue);
                setIsNewNumber(true);
                break;
            case 'M-':
                setMemory(memory - currentValue);
                setIsNewNumber(true);
                break;
            default:
                break;
        }
    };

    const ScientificButtons = () => (
        <div className="grid grid-cols-4 gap-2 mb-3">
            <button
                onClick={() => setIsRadians(!isRadians)}
                className={getButtonClassName()}
            >
                {isRadians ? 'RAD' : 'DEG'}
            </button>
            <button
                onClick={() => handleScientificOperation('sin')}
                className={getButtonClassName()}
            >
                sin
            </button>
            <button
                onClick={() => handleScientificOperation('cos')}
                className={getButtonClassName()}
            >
                cos
            </button>
            <button
                onClick={() => handleScientificOperation('tan')}
                className={getButtonClassName()}
            >
                tan
            </button>
            <button
                onClick={() => handleScientificOperation('asin')}
                className={getButtonClassName()}
            >
                sin⁻¹
            </button>
            <button
                onClick={() => handleScientificOperation('acos')}
                className={getButtonClassName()}
            >
                cos⁻¹
            </button>
            <button
                onClick={() => handleScientificOperation('atan')}
                className={getButtonClassName()}
            >
                tan⁻¹
            </button>
            <button
                onClick={() => handleScientificOperation('sqrt')}
                className={getButtonClassName()}
            >
                √
            </button>
            <button
                onClick={() => handleScientificOperation('square')}
                className={getButtonClassName()}
            >
                x²
            </button>
            <button
                onClick={() => handleScientificOperation('cube')}
                className={getButtonClassName()}
            >
                x³
            </button>
            <button
                onClick={() => handleOperator('')}
                className={getButtonClassName()}
            >
                xʸ
            </button>
            <button
                onClick={() => handleScientificOperation('1/x')}
                className={getButtonClassName()}
            >
                1/x
            </button>
            <button
                onClick={() => handleScientificOperation('log')}
                className={getButtonClassName()}
            >
                log
            </button>
            <button
                onClick={() => handleScientificOperation('ln')}
                className={getButtonClassName()}
            >
                ln
            </button>
            <button
                onClick={() => handleScientificOperation('fact')}
                className={getButtonClassName()}
            >
                n!
            </button>
            <button
                onClick={() => handleScientificOperation('pi')}
                className={getButtonClassName()}
            >
                π
            </button>
        </div>
    );

    const MemoryButtons = () => (
        <div className="grid grid-cols-4 gap-2 mb-3">
            <button
                onClick={() => handleMemory('MC')}
                className={getButtonClassName()}
            >
                MC
            </button>
            <button
                onClick={() => handleMemory('MR')}
                className={getButtonClassName()}
            >
                MR
            </button>
            <button
                onClick={() => handleMemory('M+')}
                className={getButtonClassName()}
            >
                M+
            </button>
            <button
                onClick={() => handleMemory('M-')}
                className={getButtonClassName()}
            >
                M-
            </button>
        </div>
    );

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const getButtonClassName = (type = 'default') => {
        const baseClasses = 'rounded-2xl transition-all duration-200 text-lg font-medium shadow-lg active:scale-95 p-4 ';

        const themeClasses = {
            default: isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-gray-800/20'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-gray-200/20',
            operator: isDarkMode
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-800/20 text-[15px]'
                : 'bg-orange-400 hover:bg-orange-500 text-white shadow-orange-200/20 text-[15px]',
            equal: isDarkMode
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-800/20'
                : 'bg-blue-400 hover:bg-blue-500 text-white shadow-blue-200/20',
            clear: isDarkMode
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-800/20'
                : 'bg-red-400 hover:bg-red-500 text-white shadow-red-200/20'
        };

        return baseClasses + themeClasses[type];
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        } flex items-center justify-center p-4`}>
            <div className={`max-w-md w-full ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            CalcMaster
                        </h1>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-colors duration-200 ${
                                    isDarkMode
                                        ? 'text-yellow-400 hover:bg-gray-700'
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                                aria-label="Toggle Theme"
                            >
                                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => navigate('/history')}
                                className={`p-2 rounded-full transition-colors duration-200 ${
                                    isDarkMode
                                        ? 'text-white hover:bg-gray-700'
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                                aria-label="View History"
                            >
                                <FiClock className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className={`mb-4 p-4 rounded-2xl ${
                        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
                    }`}>
                        <div className={`text-sm h-6 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {equation}
                        </div>
                        <div className={`text-4xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        } ${hasError ? 'text-red-500' : ''}`}>
                            {display}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <button c onClick={() => setIsScientific(!isScientific)} className={getButtonClassName('operator')}>
                            {isScientific ? 'Basic' : 'Scientific'}
                        </button>
                        <button onClick={handleClear} className={getButtonClassName('clear')}>C</button>
                        <button onClick={handleDelete} className={getButtonClassName('operator')}>
                            <FiDelete className="w-5 h-5 mx-auto" />
                        </button>
                        <button onClick={() => handleOperator('÷')} className={getButtonClassName('operator')}>÷</button>

                        <button onClick={() => handleNumber('7')} className={getButtonClassName()}>7</button>
                        <button onClick={() => handleNumber('8')} className={getButtonClassName()}>8</button>
                        <button onClick={() => handleNumber('9')} className={getButtonClassName()}>9</button>
                        <button onClick={() => handleOperator('×')} className={getButtonClassName('operator')}>×</button>

                        <button onClick={() => handleNumber('4')} className={getButtonClassName()}>4</button>
                        <button onClick={() => handleNumber('5')} className={getButtonClassName()}>5</button>
                        <button onClick={() => handleNumber('6')} className={getButtonClassName()}>6</button>
                        <button onClick={() => handleOperator('-')} className={getButtonClassName('operator')}>-</button>

                        <button onClick={() => handleNumber('1')} className={getButtonClassName()}>1</button>
                        <button onClick={() => handleNumber('2')} className={getButtonClassName()}>2</button>
                        <button onClick={() => handleNumber('3')} className={getButtonClassName()}>3</button>
                        <button onClick={() => handleOperator('+')} className={getButtonClassName('operator')}>+</button>

                        <button onClick={() => handleNumber('0')} className={`${getButtonClassName()} col-span-2`}>0</button>
                        <button onClick={handleDecimal} className={getButtonClassName()}>.</button>
                        <button onClick={handleEqual} className={getButtonClassName('equal')}>=</button>
                    </div>

                    {isScientific && (
                        <div className="mt-3">
                            <ScientificButtons />
                            <MemoryButtons />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Calculator;
