"use client";

import React from "react";
import { Accordion, AccordionItem, Chip } from "@heroui/react";

import { subtitle } from "@/components/primitives";

export default function Guide() {
    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <div className="text-center">
                <h1 className={`${subtitle()} font-semibold`}>쿠사포차 이용 가이드</h1>
            </div>
            <Accordion variant="shadow">
                {/* 1 */}
                <AccordionItem key="1" aria-label="Guide 1" title="1. 로그인">
                    <p className="text-sm">
                        상단 메뉴에서 <strong>로그인</strong> 버튼을 눌러 카카오 계정에 로그인하세요.
                    </p>
                    <br />
                    <p className="text-sm">
                        로그인을 하면 내 <strong>장바구니</strong>, <strong>주문 내역</strong>, 등을 확인할 수 있습니다.
                    </p>
                </AccordionItem>
                {/* 2 */}
                <AccordionItem key="2" aria-label="Guide 2" title="2. 메뉴(상품) 둘러보기">
                    <p className="text-sm">
                        메뉴 페이지에서 <strong>원하는 메뉴</strong>을 찾아보세요.
                    </p>
                </AccordionItem>
                {/* 3 */}
                <AccordionItem key="3" aria-label="Guide 3" title="3. 주문할 상품 선택 & 수량 지정">
                    <p className="text-sm">
                        개별 주문은 <strong>구매하기(Buy Now)</strong> 버튼을 누르세요.
                    </p>
                    <br />
                    <p className="text-sm">
                        여러 메뉴를 한번에 주문 하고싶으면 ‘장바구니 담기’(Cart Icon) 버튼을 눌러 여러 메뉴를 장바구니에 담으세요.
                    </p>
                </AccordionItem>
                {/* 4 */}
                <AccordionItem key="4" aria-label="Guide 4" title="4. 장바구니 확인">
                    <p className="text-sm">
                        화면 우측 상단 프로필 혹은 왼쪽 상단 메뉴에서 <strong>장바구니 아이콘</strong>을 클릭하여 담긴 메뉴들을 확인할 수 있습니다.
                    </p>
                    <br />
                    <p className="text-sm">
                        <strong>수량 조정</strong>이나 <strong>상품 삭제</strong>도 가능합니다.
                    </p>
                </AccordionItem>
                {/* 5 */}
                <AccordionItem key="5" aria-label="Guide 5" title="5. Venmo ID 입력 & 입금">
                    <p className="text-sm">
                        메뉴를 주문 할때는 <strong>꼭 본인의 Venmo ID와 테이블 번호를 입력하고 @KusaVenmo 에 송금을 해주세요.</strong>
                    </p>
                    <br />
                    <p className="text-sm">
                        <strong>최종 금액을 확인</strong> 하는것도 잊지 말아주세요.
                    </p>
                    <br />
                    <p className="text-sm">
                        @KusaVenmo 에 <strong>입금 확인</strong>이 되야 <strong>메뉴를 준비</strong> 할 수 있습니다!
                    </p>
                </AccordionItem>
                {/* 6 */}
                <AccordionItem key="6" aria-label="Guide 6" title="6. 주문 내역 확인">
                    <p className="text-sm">
                        화면 우측 상단 프로필 혹은 왼쪽 상단 메뉴에서 <strong>‘주문 내역’</strong>을 클릭하면, 내가 주문한 목록을 확인할 수 있습니다.
                    </p>
                    <br />
                    <p className="text-sm">
                        주문 상태는 총 <strong>4가지</strong>가 있습니다:
                    </p>

                    <div className="flex items-center py-2 gap-2">
                        <Chip color="warning" size="sm" variant="flat">
                            Pending
                        </Chip>
                        <p className="text-sm">주문 접수 상태</p>
                    </div>

                    <div className="flex items-center py-2 gap-2">
                        <Chip color="secondary" size="sm" variant="flat">
                            In Progress
                        </Chip>
                        <p className="text-sm">메뉴 준비/조리 중</p>
                    </div>

                    <div className="flex items-center py-2 gap-2">
                        <Chip color="success" size="sm" variant="flat">
                            Complete
                        </Chip>
                        <p className="text-sm">메뉴 전달 완료</p>
                    </div>

                    <div className="flex items-center py-2 gap-2">
                        <Chip color="danger" size="sm" variant="flat">
                            Declined
                        </Chip>
                        <p className="text-sm">주문 거절 (재료 부족, 기타 사유 등) 환불 처리됩니다.</p>
                    </div>
                </AccordionItem>
            </Accordion>
        </section>
    );
}
