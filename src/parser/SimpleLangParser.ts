// Generated from src/SimpleLang.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { SimpleLangListener } from "./SimpleLangListener.js";
import { SimpleLangVisitor } from "./SimpleLangVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class SimpleLangParser extends antlr.Parser {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly T__8 = 9;
    public static readonly T__9 = 10;
    public static readonly T__10 = 11;
    public static readonly IDENTIFIER = 12;
    public static readonly INT = 13;
    public static readonly WS = 14;
    public static readonly RULE_prog = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_variableDeclaration = 2;
    public static readonly RULE_assignment = 3;
    public static readonly RULE_displayStatement = 4;
    public static readonly RULE_expression = 5;

    public static readonly literalNames = [
        null, "'const'", "'let'", "'='", "';'", "'display'", "'('", "')'", 
        "'*'", "'/'", "'+'", "'-'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, "IDENTIFIER", "INT", "WS"
    ];
    public static readonly ruleNames = [
        "prog", "statement", "variableDeclaration", "assignment", "displayStatement", 
        "expression",
    ];

    public get grammarFileName(): string { return "SimpleLang.g4"; }
    public get literalNames(): (string | null)[] { return SimpleLangParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return SimpleLangParser.symbolicNames; }
    public get ruleNames(): string[] { return SimpleLangParser.ruleNames; }
    public get serializedATN(): number[] { return SimpleLangParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, SimpleLangParser._ATN, SimpleLangParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public prog(): ProgContext {
        let localContext = new ProgContext(this.context, this.state);
        this.enterRule(localContext, 0, SimpleLangParser.RULE_prog);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 15;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 12390) !== 0)) {
                {
                {
                this.state = 12;
                this.statement();
                }
                }
                this.state = 17;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 18;
            this.match(SimpleLangParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 2, SimpleLangParser.RULE_statement);
        try {
            this.state = 24;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 20;
                this.variableDeclaration();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 21;
                this.assignment();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 22;
                this.displayStatement();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 23;
                this.expression(0);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableDeclaration(): VariableDeclarationContext {
        let localContext = new VariableDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 4, SimpleLangParser.RULE_variableDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 26;
            _la = this.tokenStream.LA(1);
            if(!(_la === 1 || _la === 2)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 27;
            this.match(SimpleLangParser.IDENTIFIER);
            this.state = 28;
            this.match(SimpleLangParser.T__2);
            this.state = 29;
            this.expression(0);
            this.state = 30;
            this.match(SimpleLangParser.T__3);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assignment(): AssignmentContext {
        let localContext = new AssignmentContext(this.context, this.state);
        this.enterRule(localContext, 6, SimpleLangParser.RULE_assignment);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 32;
            this.match(SimpleLangParser.IDENTIFIER);
            this.state = 33;
            this.match(SimpleLangParser.T__2);
            this.state = 34;
            this.expression(0);
            this.state = 35;
            this.match(SimpleLangParser.T__3);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public displayStatement(): DisplayStatementContext {
        let localContext = new DisplayStatementContext(this.context, this.state);
        this.enterRule(localContext, 8, SimpleLangParser.RULE_displayStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 37;
            this.match(SimpleLangParser.T__4);
            this.state = 38;
            this.match(SimpleLangParser.T__5);
            this.state = 39;
            this.match(SimpleLangParser.IDENTIFIER);
            this.state = 40;
            this.match(SimpleLangParser.T__6);
            this.state = 41;
            this.match(SimpleLangParser.T__3);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expression(): ExpressionContext;
    public expression(_p: number): ExpressionContext;
    public expression(_p?: number): ExpressionContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExpressionContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 10;
        this.enterRecursionRule(localContext, 10, SimpleLangParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 50;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SimpleLangParser.T__5:
                {
                this.state = 44;
                this.match(SimpleLangParser.T__5);
                this.state = 45;
                this.expression(0);
                this.state = 46;
                this.match(SimpleLangParser.T__6);
                }
                break;
            case SimpleLangParser.IDENTIFIER:
                {
                this.state = 48;
                this.match(SimpleLangParser.IDENTIFIER);
                }
                break;
            case SimpleLangParser.INT:
                {
                this.state = 49;
                this.match(SimpleLangParser.INT);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 57;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    {
                    localContext = new ExpressionContext(parentContext, parentState);
                    this.pushNewRecursionContext(localContext, _startState, SimpleLangParser.RULE_expression);
                    this.state = 52;
                    if (!(this.precpred(this.context, 3))) {
                        throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                    }
                    this.state = 53;
                    localContext._op = this.tokenStream.LT(1);
                    _la = this.tokenStream.LA(1);
                    if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 3840) !== 0))) {
                        localContext._op = this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 54;
                    this.expression(4);
                    }
                    }
                }
                this.state = 59;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 5:
            return this.expression_sempred(localContext as ExpressionContext, predIndex);
        }
        return true;
    }
    private expression_sempred(localContext: ExpressionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 3);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,14,61,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,1,0,5,
        0,14,8,0,10,0,12,0,17,9,0,1,0,1,0,1,1,1,1,1,1,1,1,3,1,25,8,1,1,2,
        1,2,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,4,1,4,
        1,5,1,5,1,5,1,5,1,5,1,5,1,5,3,5,51,8,5,1,5,1,5,1,5,5,5,56,8,5,10,
        5,12,5,59,9,5,1,5,0,1,10,6,0,2,4,6,8,10,0,2,1,0,1,2,1,0,8,11,61,
        0,15,1,0,0,0,2,24,1,0,0,0,4,26,1,0,0,0,6,32,1,0,0,0,8,37,1,0,0,0,
        10,50,1,0,0,0,12,14,3,2,1,0,13,12,1,0,0,0,14,17,1,0,0,0,15,13,1,
        0,0,0,15,16,1,0,0,0,16,18,1,0,0,0,17,15,1,0,0,0,18,19,5,0,0,1,19,
        1,1,0,0,0,20,25,3,4,2,0,21,25,3,6,3,0,22,25,3,8,4,0,23,25,3,10,5,
        0,24,20,1,0,0,0,24,21,1,0,0,0,24,22,1,0,0,0,24,23,1,0,0,0,25,3,1,
        0,0,0,26,27,7,0,0,0,27,28,5,12,0,0,28,29,5,3,0,0,29,30,3,10,5,0,
        30,31,5,4,0,0,31,5,1,0,0,0,32,33,5,12,0,0,33,34,5,3,0,0,34,35,3,
        10,5,0,35,36,5,4,0,0,36,7,1,0,0,0,37,38,5,5,0,0,38,39,5,6,0,0,39,
        40,5,12,0,0,40,41,5,7,0,0,41,42,5,4,0,0,42,9,1,0,0,0,43,44,6,5,-1,
        0,44,45,5,6,0,0,45,46,3,10,5,0,46,47,5,7,0,0,47,51,1,0,0,0,48,51,
        5,12,0,0,49,51,5,13,0,0,50,43,1,0,0,0,50,48,1,0,0,0,50,49,1,0,0,
        0,51,57,1,0,0,0,52,53,10,3,0,0,53,54,7,1,0,0,54,56,3,10,5,4,55,52,
        1,0,0,0,56,59,1,0,0,0,57,55,1,0,0,0,57,58,1,0,0,0,58,11,1,0,0,0,
        59,57,1,0,0,0,4,15,24,50,57
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!SimpleLangParser.__ATN) {
            SimpleLangParser.__ATN = new antlr.ATNDeserializer().deserialize(SimpleLangParser._serializedATN);
        }

        return SimpleLangParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(SimpleLangParser.literalNames, SimpleLangParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return SimpleLangParser.vocabulary;
    }

    private static readonly decisionsToDFA = SimpleLangParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.EOF, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_prog;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterProg) {
             listener.enterProg(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitProg) {
             listener.exitProg(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitProg) {
            return visitor.visitProg(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variableDeclaration(): VariableDeclarationContext | null {
        return this.getRuleContext(0, VariableDeclarationContext);
    }
    public assignment(): AssignmentContext | null {
        return this.getRuleContext(0, AssignmentContext);
    }
    public displayStatement(): DisplayStatementContext | null {
        return this.getRuleContext(0, DisplayStatementContext);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_statement;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_variableDeclaration;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterVariableDeclaration) {
             listener.enterVariableDeclaration(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitVariableDeclaration) {
             listener.exitVariableDeclaration(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitVariableDeclaration) {
            return visitor.visitVariableDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AssignmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_assignment;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterAssignment) {
             listener.enterAssignment(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitAssignment) {
             listener.exitAssignment(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitAssignment) {
            return visitor.visitAssignment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DisplayStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0)!;
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_displayStatement;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterDisplayStatement) {
             listener.enterDisplayStatement(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitDisplayStatement) {
             listener.exitDisplayStatement(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitDisplayStatement) {
            return visitor.visitDisplayStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionContext extends antlr.ParserRuleContext {
    public _op?: Token | null;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SimpleLangParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_expression;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterExpression) {
             listener.enterExpression(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitExpression) {
             listener.exitExpression(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitExpression) {
            return visitor.visitExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
