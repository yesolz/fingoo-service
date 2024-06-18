import { useChat } from 'ai/react';
import { generateId, type ChatRequest, type ToolCallHandler } from 'ai';
import usePredictIndicator from './use-prdict-indicator.hook';
import useInstruction from './use-instruction.hook';
import useAnalyzeEconomy from './use-analyze-economy.hook';

//   // 1. symbol을 이용하여 indicatorId를 가져온다(동적 저장소)
//   // 2. 메타데이터 생성
//   // 3. 메타데이터에 지표 추가
//   // 4. 지표 값 가져오기(cache로 데이터 가져오기?)
//   // 5. 분석 값 넣기
//   // 6. 분석에 대한 해석 제공

export const useFingooChat = () => {
  const { predictEconomicIndicatorHandler } = usePredictIndicator();
  const { getInstruction } = useInstruction();
  const { analyzeEconomicHandler } = useAnalyzeEconomy();

  const toolCallHandler: ToolCallHandler = async (chatMessages, toolCalls) => {
    console.log('client');
    console.log('chatMessages:', chatMessages);
    console.log('toolCalls:', toolCalls);
    const functionCall = toolCalls[0].function;

    let content: string | undefined;
    const parsedFunctionCallArguments = JSON.parse(functionCall.arguments);

    if (functionCall.name === 'get_instructions') {
      content = getInstruction(
        parsedFunctionCallArguments as {
          query: string;
        },
      );
    }

    if (functionCall.name === 'predict_economic_indicator') {
      content = await predictEconomicIndicatorHandler(
        parsedFunctionCallArguments as {
          target_symbol: string;
          source_symbols: string[];
        },
      );
    }

    if (functionCall.name === 'analyze_economic_indicators') {
      const { symbols } = parsedFunctionCallArguments as {
        symbols: string[];
      };

      content = await analyzeEconomicHandler(symbols);

      content = JSON.stringify(
        `
          관련 분석 심볼: ${symbols}
          
          - 관련있는 지표를 왜 해당 지표가 질문과 관련있는지 설명해야합니다.
          - 지표를 중심으로 전체적인 흐름과 상황을 분석해주어야합니다.
          
        `,
      );
    }

    if (functionCall.name === 'explain_economic_indicator') {
      const { symbol } = parsedFunctionCallArguments as {
        symbol: string;
      };

      content = JSON.stringify(
        `
        ${symbol}에 대한 정보를 설명합니다.

        - 5살짜리도 이해할 수 있도록 쉽고 자세히 설명해야 합니다.
        - 지표의 의미와 중요성을 설명해야 합니다.
        - 지표의 특징과 활용 방법을 설명해야 합니다.
        `,
      );
    }

    if (functionCall.name === 'recommend_economic_indicator') {
      const { symbols } = parsedFunctionCallArguments as {
        symbols: string[];
      };

      content = JSON.stringify(
        `
          추천 심볼 리스트: ${symbols}
          
          - 왜 해당 심볼을 추천하는지에 대한 이유를 설명해야합니다.
          
        `,
      );
    }

    const functionResponse: ChatRequest = {
      messages: [
        ...chatMessages,
        {
          id: generateId(),
          tool_call_id: toolCalls[0].id,
          name: functionCall.name,
          role: 'tool' as const,
          content: content ?? '기능이 구현되지 않았습니다.',
        },
      ],
    };
    return functionResponse;
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    experimental_onToolCall: toolCallHandler,
    onFinish: (message) => {
      console.log('finished', message);
    },
    onResponse: (response) => {
      console.log('response', response);
    },
  });

  return {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};
